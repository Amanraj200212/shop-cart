import { MetaData } from "@/actions/createCheckoutSession";
import { backendClient } from "@/lib/backendClient";
import stripe from "@/lib/strips";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req:NextRequest){
  const body = await req.text();
  const headerList = await headers();

  const sig = headerList.get("stripe-signature");
  if(!sig) {
    return NextResponse.json(
      {error: " No Signature found for stripe"},
      {status: 400}
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if(!webhookSecret) {
    return NextResponse.json(
      {error: " Stripe webhook secret is not set"},
      {status: 404}
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("webhook signature verification failed", error);
    return NextResponse.json(
      {error: `Webhook Error: ${error}`},
      {status: 400}
    );
  }

  if(event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoice = session.invoice ? await stripe.invoices.retrieve(session.invoice as string) : null;

    try {
      await createOrderInSanity(session, invoice)
    } catch (error) {
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        {error: `Error creating order: ${error}`},
        {status: 404}
      );
    }
  }
  return NextResponse.json({received: true})
}

async function createOrderInSanity(
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  const {id, amount_total, currency, metadata, payment_intent, total_details} = session;
  const {orderNumber, customerName, customerEmail,clerkUserId, address} = metadata as unknown as MetaData & {address: string};
  const parsedAddress = address ? JSON.parse(address) : null;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {expand: ["data.price.product"]}
  );

  //Create sanity product references and prepare stoock updates
  const sanityProducts = [];
  const stockUpdate = []
  for(const item of lineItemsWithProduct.data) {
    const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
    const quantity = item?.quantity || 0;

    if(!productId) continue;

    sanityProducts.push({
      _key: crypto.randomUUID(),
      product: {
        _type: 'reference',
        _ref: productId,
      },
      quantity,
    });
    stockUpdate.push({productId, quantity})
  };

  //create order in sanity
  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customerEmail,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,

    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : null,
    address: parsedAddress
      ? {
          state: parsedAddress.state,
          zip: parsedAddress.zip,
          city: parsedAddress.city,
          address: parsedAddress.address,
          name: parsedAddress.name,
        }
      : null,
  });

  //update stock levels in sanity
  await updateStockLevels (stockUpdate);
  return order;
}


//function to update stock levels
async function updateStockLevels(
  stockUpdates: {productId: string; quantity: number}[]
) {
  for(const {productId, quantity} of stockUpdates) {
    try {
      //fetcch current stocks
      const product = await backendClient.getDocument(productId);

      if(!product || typeof product.stock !== "number") {
        console.warn(`Product with Id ${productId} not found or stock is invalid`);
        continue;
      };

      const newStock = Math.max(product.stock - quantity, 0); //enxure stock doesnt go to negative

      // fianlly update stock in sanity
      await backendClient.patch(productId).set({stock: newStock}).commit();
    } catch (error) {
      console.error(`Failed to Update stock for product ${productId}:`, error)
    }
  }
}