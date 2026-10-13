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

## Web Push Notifications

This app uses standard browser/PWA push notifications for admin new-order alerts and customer order-status updates. It does not send email notifications.

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Configure these server-side environment variables in local `.env` and in production:

```bash
WEB_PUSH_VAPID_PUBLIC_KEY=your_public_key
WEB_PUSH_VAPID_PRIVATE_KEY=your_private_key
WEB_PUSH_VAPID_SUBJECT=mailto:owner@example.com
```

Keep `WEB_PUSH_VAPID_PRIVATE_KEY` private. The app exposes only the public key through `/api/push/public-key` when a signed-in user explicitly enables notifications.

Deployment notes:

- Deploy `public/sw.js` with the app and serve the production site over HTTPS.
- Add the production domain, for example `https://kiranadukan.shop`, to Clerk and Sanity settings as needed.
- Open `/admin/orders` as an authorized admin and enable new-order notifications on each admin device.
- Open `/orders` as a customer and enable order-status notifications on each customer device.
- Browser permission is requested only after pressing Enable.

Testing checklist:

- Place a successful COD/manual UPI order and confirm the admin device receives the order number and total.
- Confirm failed or abandoned checkout attempts do not create orders or send admin notifications.
- Change an order status in `/admin/orders` and confirm only that order owner's subscribed customer device receives the status update.
- Click admin notifications and confirm they open `/admin/orders?orderId=...`.
- Click customer notifications and confirm they open `/orders?orderId=...` and show the matching order details dialog.
- Re-select the same status and confirm no duplicate customer notification is sent.
- Confirm unauthorized users cannot access admin subscriptions or another customer's subscriptions.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
