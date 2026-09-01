import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "userId",
      title: "Clerk User ID",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Address Label",
      type: "string",
      description: "A friendly label for this address.",
      options: {
        list: [
          { title: "Home", value: "Home" },
          { title: "Work", value: "Work" },
          { title: "Other", value: "Other" },
        ],
        layout: "radio",
      },
      initialValue: "Home",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
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
      title: "Address Line 1",
      type: "string",
      description: "The street address including house number and street name",
      validation: (Rule) => Rule.required().min(5).max(150),
    }),
    defineField({
      name: "addressLine2",
      title: "Address Line 2",
      type: "string",
      description: "Apartment, floor, landmark, or other delivery detail",
      validation: (Rule) => Rule.max(150),
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
      name: "pinCode",
      title: "Pin Code",
      type: "string",
      description: "Indian PIN code. Exactly 6 digits and cannot start with 0.",
      validation: (Rule) =>
        Rule.required().regex(/^[1-9][0-9]{5}$/, {
          name: "pinCode",
        }),
    }),
    defineField({
      name: "zip",
      title: "Pin Code (Deprecated)",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => value === undefined,
      deprecated: {
        reason: "Use pinCode instead. This field is kept only for existing address data.",
      },
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      initialValue: "India",
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
      validation: (Rule) => Rule.min(-180).max(180),
    }),
  ],

  //santiy stdio me preview ke liye
  preview: {
    select: {
      title: "name",
      fullName: "fullName",
      address: "address",
      city: "city",
      state: "state",
      isDefault: "default",
    },

    prepare({ title, fullName, address, city, state, isDefault }) {
      const location = [address, city, state]
        .filter(Boolean)
        .join(", ");

      return {
        title: `${title || "Unnamed Address"}${fullName ? ` - ${fullName}` : ""}${
          isDefault ? " (Default)" : ""
        }`,
        subtitle: location,
      };
    },
  },
});
