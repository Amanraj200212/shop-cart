// Added a protected cleanup command:
// npm run clear-shop-content

// This only previews deletion. The real deletion requires:
// npm run clear-shop-content -- --confirm


import "dotenv/config";

import { backendClient } from "../lib/backendClient";

const typesToDelete = ["product"] as const;
const isConfirmed = process.argv.includes("--confirm");

const main = async () => {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is required");
  }

  const documents = await backendClient.fetch<Array<{ _id: string; _type: string }>>(
    `*[_type in $types]{_id, _type}`,
    { types: typesToDelete }
  );

  const counts = typesToDelete.reduce<Record<string, number>>((result, type) => {
    result[type] = documents.filter((document) => document._type === type).length;
    return result;
  }, {});

  console.log("Documents selected for deletion:");
  typesToDelete.forEach((type) => console.log(`- ${type}: ${counts[type]}`));
  console.log("Preserved: brand, category, blog, blogcategory, author, order, address");

  if (!isConfirmed) {
    console.log("\nDry run only. Add --confirm to permanently delete these documents.");
    return;
  }

  for (let index = 0; index < documents.length; index += 100) {
    const batch = documents.slice(index, index + 100);
    const transaction = backendClient.transaction();
    batch.forEach((document) => transaction.delete(document._id));
    await transaction.commit();
    console.log(`Deleted ${Math.min(index + batch.length, documents.length)}/${documents.length}`);
  }

  console.log("\nCleanup completed.");
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});