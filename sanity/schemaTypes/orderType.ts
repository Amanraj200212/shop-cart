import { defineArrayMember, defineField, defineType } from "sanity";
import { BasketIcon} from "@sanity/icons"

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "invoice",
      type: "object",
      fields: [
          {name: "id", type: "string"},
          {name: "number", type: "string"},
          {name: "hosted_invoice_url", type: "url"},
      ],
    }),
    defineField({
      name: "stripCheckoutSessionId",
      title: "Strip Checkout Session Id",
      type: "string",
    }),
    defineField({
      name: "stripCustomerId",
      title: "Strip Customer Id",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User Id",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "stripe Payment Intent Id",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{type: "product"}],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],

          //for preview into sanity
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity" ,
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "state", title: "State", type: "string"}),
        defineField({ name: "zip", title: "Zip Code", type: "string"}),
        defineField({ name: "city", title: "City", type: "string"}),
        defineField({ name: "address", title: "Address", type: "string"}),
        defineField({ name: "name", title: "Name", type: "string"}),
      ]
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          {title: "pending", value: "pending"},
          {title: "Processing", value: "processing"},
          {title: "Paid", value: "paid"},
          {title: "Shipped", value: "shipped"},
          {title: "Out For Delivery", value: "out_for_delivery"},
          {title: "Delivered", value: "delivered"},
          {title: "cancelled", value: "Cancelled"},
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice" ,
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
    },
    prepare(select) {
      const orderIdSnippet =  `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;

      return {
        title: `${select.name} (${orderIdSnippet}) `,
        subtitle: `${select.amount} ${select.currency}, ${select.email}`,
        media: BasketIcon,
      };
    },
  },
});