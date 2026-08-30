import { defineField, defineType } from "sanity";
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
      description: "A friendly name for this address (e.g. Home, Work)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(/^[6-9]\d{9}$/, {
          name: "phoneNumber",
        }),
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
      description: "Enter your city name (e.g. Patna, Mumbai, Delhi)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      description: "Enter your state name (e.g. Bihar, Maharashtra, Delhi)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "zip",
      title: "Pin Code",
      type: "string",
      description: "Format: 84141xx or 1200xx",
      validation: (Rule) =>
        Rule.required().regex(/^[1-9][0-9]{5}$/, {
          name: "zip",
        }),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
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
    select: {
      title: "name",
      address: "address",
      city: "city",
      state: "state",
      isDefault: "default",
    },

    prepare({ title, address, city, state, isDefault }) {
      const location = [address, city, state]
        .filter(Boolean)
        .join(", ");

      return {
        title: `${title || "Unnamed Address"}${
          isDefault ? " (Default)" : ""
        }`,
        subtitle: location,
      };
    },
  },
});
