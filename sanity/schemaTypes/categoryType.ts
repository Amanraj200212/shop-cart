//defining the category schema for sanity

import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";

export const categoryType= defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagsIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      validation: (Rule) => Rule.required().error("Slug is required"),
      options:{
        source: "title",
        maxLength: 96,
      }
    }),
    defineField({
      name: "description",
      type: "string",
    }),
    defineField({
      name: "range",
      type: "number",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      }
    }),
  ],
  preview: {
    select:{
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});