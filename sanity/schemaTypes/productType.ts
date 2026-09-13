import { defineField, defineType } from "sanity";
import { TrolleyIcon} from "@sanity/icons"

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{type: "image", options: {hotspot: true} }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "sellingType",
      title: "Selling Type",
      type: "string",
      initialValue: "fixed",
      options: {
        list: [
          { title: "Fixed", value: "fixed" },
          { title: "Loose", value: "loose" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      hidden: ({ parent }) => parent?.sellingType === "loose",
      validation: (Rule) =>
        Rule.custom((price, context) => {
          const parent = context.parent as { sellingType?: string } | undefined;

          if (parent?.sellingType === "loose") return true;
          if (typeof price !== "number") return "Price is required for fixed products.";
          if (price < 0) return "Price must be 0 or higher.";

          return true;
        }),
    }),
    defineField({
      name: "pricePerKg",
      title: "Price Per Kg",
      type: "number",
      hidden: ({ parent }) => parent?.sellingType !== "loose",
      validation: (Rule) =>
        Rule.custom((pricePerKg, context) => {
          const parent = context.parent as { sellingType?: string } | undefined;

          if (parent?.sellingType === "loose" && typeof pricePerKg !== "number") {
            return "Price per kg is required for loose products.";
          }

          return true;
        }).min(0),
    }),
    defineField({
      name: "weightIncrement",
      title: "Weight Increment (grams)",
      type: "number",
      hidden: ({ parent }) => parent?.sellingType !== "loose",
      validation: (Rule) =>
        Rule.custom((weightIncrement, context) => {
          const parent = context.parent as { sellingType?: string } | undefined;

          if (
            parent?.sellingType === "loose" &&
            (typeof weightIncrement !== "number" || weightIncrement <= 0)
          ) {
            return "Weight increment is required for loose products.";
          }

          return true;
        }).integer(),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      hidden: ({ parent }) => parent?.sellingType === "loose",
      validation: (Rule) =>
        Rule.custom((discount, context) => {
          const parent = context.parent as { sellingType?: string } | undefined;

          if (parent?.sellingType === "loose") return true;
          if (typeof discount !== "number") return "Discount is required for fixed products.";
          if (discount < 0) return "Discount must be 0 or higher.";

          return true;
        }),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{type: "reference", to: {type: "category"}}]
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: {type: "brand"}
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          {title: "New", value: "new"},
          {title: "Hot", value: "hot"},
          {title: "Sale", value: "sale"},
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          {title: "Gadget", value: "gadget"},
          {title: "newb", value: "newb"},
          {title: "Appliances", value: "appliances"},
          {title: "Refrigerators", value: "refrigerators"},
          {title: "Others", value: "others"},
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
  ],

  // for preview into sanity
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
      isFeatured: "isFeatured",
    },
    prepare(selection){
      const {title, media, subtitle} = selection;
      const image= media && media[0];
      return{
        title: title,
        subtitle: `$${subtitle}`,
        media: image,
      };
    },
  },
});
