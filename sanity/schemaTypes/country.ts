import { defineField, defineType } from "sanity";

export default defineType({
  name: "country",
  title: "Country",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "flagImage", title: "Flag / Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "popular", title: "Show in Popular Destinations", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", media: "flagImage" } },
});
