import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      description: "A name for this address (e.g., Home, Work, etc.)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
      description: "The street address including house number and street name",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: "two letter state code (e.g., BR, MH, NDH)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "zip",
      title: "Zip Code",
      type: "string",
      description: "Format: 12345 or 12345-6789",
      validation: (Rule) => 
        Rule.required()
        .regex(/^\d{5}(-\d{4})?$/, {
          name: "zipCode",
          invert: false,
        })
        .custom((zip: string | undefined) => {
          if(!zip) {
            return "Zip code is required";
          }
          if (!zip.match(/^\d{5}(-\d{4})?$/)) {
            return "Invalid zip code format. Please use 12345 or 12345-6789";
          }
          return true;
        }),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "is this the default shipping address?",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],

  //santiy stdio me preview ke liye
  preview: {
    select:{
      title: "name",
      subtitle: "address",
      city: "city",
      state: "state",
      isDefault: "default",
    },
    prepare({title, subtitle, city, state, isDefault}) {
      return {
        title: `${title} ${isDefault ? "(Default)" : ""}`,
        subtitle: `${subtitle}, ${city}, ${state}`,
      };
    },
  },
});
