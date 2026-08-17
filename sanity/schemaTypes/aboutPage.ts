import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",

  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      group: "content",
      initialValue: "About The Scholarship Circle",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      group: "content",
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),

    defineField({
      name: "body",
      title: "About Content",
      type: "array",
      group: "content",
      of: [
        { type: "block" },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
          ],
        },
      ],
    }),

    defineField({
      name: "mission",
      title: "Our Mission",
      type: "text",
      rows: 4,
      group: "content",
    }),

    defineField({
      name: "vision",
      title: "Our Vision",
      type: "text",
      rows: 4,
      group: "content",
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "featuredImage",
    },
  },
});