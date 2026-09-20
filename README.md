This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Bulk Product Import

Prepare products in `data/products.csv` using this header:

```csv
name,brand,category,price,stock,sellingType,pricePerKg,weightIncrement,status,variant,isFeatured,description,imageUrl
```

Use existing brand and category titles. Fixed products require `price`; loose products require `pricePerKg` and `weightIncrement` in grams. `imageUrl` is optional and uploads the image to Sanity during a real import.

Preview without writing to Sanity:

```bash
npm run import-products -- --dry-run
```

Run the real import:

```bash
npm run import-products
```

Use another CSV with `--csv=data/other-products.csv`. Existing products are skipped by slug, while missing references and invalid rows are reported and do not stop other rows. The importer uses `SANITY_API_TOKEN` from the local `.env` file and runs server-side only.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
