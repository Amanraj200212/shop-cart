import { BellIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const pushSubscriptionType = defineType({
  name: "pushSubscription",
  title: "Push Subscription",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Customer", value: "customer" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "adminEmail",
      title: "Admin Email",
      type: "string",
      hidden: ({ document }) => document?.role !== "admin",
    }),
    defineField({
      name: "endpoint",
      title: "Endpoint",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscription",
      title: "Subscription",
      type: "object",
      fields: [
        defineField({ name: "endpoint", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "expirationTime", type: "number" }),
        defineField({
          name: "keys",
          type: "object",
          fields: [
            defineField({ name: "p256dh", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "auth", type: "string", validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastFailure",
      title: "Last Failure",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      role: "role",
      userId: "userId",
      active: "active",
      updatedAt: "updatedAt",
    },
    prepare(select) {
      return {
        title: `${select.role} push subscription`,
        subtitle: `${select.active ? "Active" : "Inactive"} - ${select.userId} - ${select.updatedAt}`,
      };
    },
  },
});
