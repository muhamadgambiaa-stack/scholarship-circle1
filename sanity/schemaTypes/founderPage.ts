import { defineField, defineType } from "sanity";

export default defineType({
  name: "founderPage",
  title: "Founder Page",
  type: "document",

  groups: [
    { name: "content", title: "Founder Information" },
    { name: "social", title: "Social & Links" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "name",
      title: "Founder Name",
      type: "string",
      group: "content",
      initialValue: "Muhammed J Bah",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "role",
      title: "Role",
      type: "string",
      group: "content",
      initialValue: "Founder of The Scholarship Circle",
    }),

    defineField({
      name: "photo",
      title: "Founder Photo",
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "shortBio",
      title: "Short Biography",
      type: "text",
      rows: 5,
      group: "content",
    }),

    defineField({
      name: "bio",
      title: "Full Biography",
      type: "array",
      group: "content",
      of: [
        { type: "block" },
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      group: "content",
      of: [
        {
          type: "string",
        },
      ],
    }),

    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
      group: "social",
    }),

    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
      group: "social",
    }),

    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
      group: "social",
    }),

    defineField({
      name: "youtube",
      title: "YouTube",
      type: "url",
      group: "social",
    }),

    defineField({
      name: "website",
      title: "Personal Website",
      type: "url",
      group: "social",
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
      title: "name",
      subtitle: "role",
      media: "photo",
    },
  },
});