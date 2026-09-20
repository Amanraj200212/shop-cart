import "dotenv/config";

import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { backendClient } from "../lib/backendClient";

const CSV_HEADERS = [
  "name",
  "brand",
  "category",
  "price",
  "stock",
  "sellingType",
  "pricePerKg",
  "weightIncrement",
  "status",
  "variant",
  "isFeatured",
  "description",
  "imageUrl",
] as const;

type CsvHeader = (typeof CSV_HEADERS)[number];
type SellingType = "fixed" | "loose";
type ProductStatus = "new" | "hot" | "sale";
type ProductVariant = "dailyuse" | "soapsurf" | "chocolates" | "colddrinks" | "others";

type CsvRow = Record<CsvHeader, string>;

type ReferenceDocument = {
  _id: string;
  title?: string;
};

type ExistingProduct = {
  _id: string;
  slug?: string;
};

type ProductImage = {
  _type: "image";
  _key: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
};

type ProductPayload = {
  _type: "product";
  name: string;
  slug: { _type: "slug"; current: string };
  description?: string;
  sellingType: SellingType;
  price?: number;
  pricePerKg?: number;
  weightIncrement?: number;
  categories: Array<{ _key: string; _type: "reference"; _ref: string }>;
  stock: number;
  brand: { _type: "reference"; _ref: string };
  status: ProductStatus;
  variant: ProductVariant;
  isFeatured: boolean;
  images?: ProductImage[];
};

type ImportFailure = {
  row: number;
  reason: string;
};

const dryRun = process.argv.includes("--dry-run");
const csvArgument = process.argv.find((argument) => argument.startsWith("--csv="));
const csvPath = resolve(process.cwd(), csvArgument?.slice("--csv=".length) || "data/products.csv");

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const slugify = (value: string) => {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

  if (!slug) throw new Error("Name does not produce a valid slug");
  return slug;
};

const parseCsv = (content: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value.trim())) rows.push(row);
  }

  return rows;
};

const parseNumber = (value: string, field: string) => {
  const parsed = Number(value);
  if (!value || !Number.isFinite(parsed)) {
    throw new Error(`${field} must be a number`);
  }
  return parsed;
};

const parseBoolean = (value: string, field: string) => {
  if (!value) return false;
  if (["true", "1", "yes"].includes(normalize(value))) return true;
  if (["false", "0", "no"].includes(normalize(value))) return false;
  throw new Error(`${field} must be true or false`);
};

const getRows = (content: string): CsvRow[] => {
  const [headerRow, ...dataRows] = parseCsv(content);
  if (!headerRow) throw new Error("CSV is empty");

  const headers = headerRow.map((header) => header.trim()) as string[];
  const missingHeaders = CSV_HEADERS.filter((header) => !headers.includes(header));
  if (missingHeaders.length) {
    throw new Error(`Missing CSV headers: ${missingHeaders.join(", ")}`);
  }

  return dataRows.map((values, index) => {
    if (values.length > headers.length) {
      throw new Error(`Row ${index + 2} has more values than the header`);
    }

    return CSV_HEADERS.reduce((row, header) => {
      const valueIndex = headers.indexOf(header);
      row[header] = values[valueIndex] ?? "";
      return row;
    }, {} as CsvRow);
  });
};

const findByTitle = (documents: ReferenceDocument[], title: string) =>
  documents.find((document) => normalize(document.title || "") === normalize(title));

const validateRow = (
  row: CsvRow,
  rowNumber: number,
  brandDocuments: ReferenceDocument[],
  categoryDocuments: ReferenceDocument[],
  existingSlugs: Set<string>,
  seenSlugs: Set<string>
) => {
  if (!row.name.trim()) throw new Error("name is required");
  if (!row.brand.trim()) throw new Error("brand is required");
  if (!row.category.trim()) throw new Error("category is required");

  const brand = findByTitle(brandDocuments, row.brand);
  if (!brand) throw new Error(`Brand "${row.brand.trim()}" not found`);

  const category = findByTitle(categoryDocuments, row.category);
  if (!category) throw new Error(`Category "${row.category.trim()}" not found`);

  const slug = slugify(row.name);
  if (existingSlugs.has(slug) || seenSlugs.has(slug)) {
    return { status: "skipped" as const, slug, brand, category };
  }

  const sellingType = normalize(row.sellingType) as SellingType;
  if (!["fixed", "loose"].includes(sellingType)) {
    throw new Error(`sellingType must be fixed or loose`);
  }

  const stock = parseNumber(row.stock, "stock");
  if (stock < 0 || !Number.isInteger(stock)) {
    throw new Error("stock must be a whole number greater than or equal to 0");
  }

  const status = (normalize(row.status) || "new") as ProductStatus;
  if (!["new", "hot", "sale"].includes(status)) throw new Error("status must be new, hot, or sale");

  const variant = (normalize(row.variant) || "others") as ProductVariant;
  if (!["dailyuse", "soapsurf", "chocolates", "colddrinks", "others"].includes(variant)) {
    throw new Error("variant must be dailyuse, soapsurf, chocolates, colddrinks, or others");
  }

  const isFeatured = parseBoolean(row.isFeatured, "isFeatured");
  const product: ProductPayload = {
    _type: "product",
    name: row.name.trim(),
    slug: { _type: "slug", current: slug },
    description: row.description.trim() || undefined,
    sellingType,
    categories: [{ _key: randomUUID(), _type: "reference", _ref: category._id }],
    stock,
    brand: { _type: "reference", _ref: brand._id },
    status,
    variant,
    isFeatured,
  };

  if (sellingType === "fixed") {
    product.price = parseNumber(row.price, "price");
    if (product.price < 0) throw new Error("price must be greater than or equal to 0");
  } else {
    product.pricePerKg = parseNumber(row.pricePerKg, "pricePerKg");
    product.weightIncrement = parseNumber(row.weightIncrement, "weightIncrement");
    if (product.pricePerKg < 0) throw new Error("pricePerKg must be greater than or equal to 0");
    if (product.weightIncrement <= 0 || !Number.isInteger(product.weightIncrement)) {
      throw new Error("weightIncrement must be a positive whole number in grams");
    }
  }

  if (row.imageUrl.trim()) {
    try {
      new URL(row.imageUrl.trim());
    } catch {
      throw new Error("imageUrl must be a valid URL");
    }
  }

  seenSlugs.add(slug);
  return { status: "create" as const, slug, product, imageUrl: row.imageUrl.trim() };
};

const uploadImage = async (imageUrl: string): Promise<ProductImage> => {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`imageUrl returned HTTP ${response.status}`);

  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const urlPath = new URL(imageUrl).pathname;
  const filename = basename(urlPath) || "product-image";
  const asset = await backendClient.assets.upload("image", imageBuffer, { filename });

  return {
    _type: "image",
    _key: randomUUID(),
    asset: { _type: "reference", _ref: asset._id },
  };
};

const main = async () => {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is required for the importer");
  }

  const content = await readFile(csvPath, "utf8");
  const rows = getRows(content);
  const [brandDocuments, categoryDocuments, existingProducts] = await Promise.all([
    backendClient.fetch<ReferenceDocument[]>(`*[_type == "brand"]{_id, title}`),
    backendClient.fetch<ReferenceDocument[]>(`*[_type == "category"]{_id, title}`),
    backendClient.fetch<ExistingProduct[]>(`*[_type == "product" && defined(slug.current)]{_id, "slug": slug.current}`),
  ]);

  const existingSlugs = new Set(
    existingProducts.flatMap((product) => (product.slug ? [product.slug] : []))
  );
  const seenSlugs = new Set<string>();
  const failures: ImportFailure[] = [];
  let created = 0;
  let skipped = 0;

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    try {
      const result = validateRow(
        row,
        rowNumber,
        brandDocuments,
        categoryDocuments,
        existingSlugs,
        seenSlugs
      );

      if (result.status === "skipped") {
        skipped += 1;
        console.log(`SKIPPED - row ${rowNumber} already exists (${result.slug})`);
        continue;
      }

      if (dryRun) {
        created += 1;
        console.log(`WOULD CREATE - row ${rowNumber}: ${result.product.name} (${result.slug})`);
        continue;
      }

      if (result.imageUrl) {
        result.product.images = [await uploadImage(result.imageUrl)];
      }

      await backendClient.create(result.product);
      created += 1;
      existingSlugs.add(result.slug);
      console.log(`CREATED - row ${rowNumber}: ${result.product.name}`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error";
      failures.push({ row: rowNumber, reason });
      console.error(`❌ Row ${rowNumber} - ${reason}`);
    }
  }

  console.log("\nImport completed");
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failures.length}`);
  if (dryRun) console.log("Mode: dry run (no Sanity documents or images were written)");
  if (failures.length) {
    console.log("\nFailed rows:");
    failures.forEach(({ row, reason }) => console.log(`- Row ${row}: ${reason}`));
    process.exitCode = 1;
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});