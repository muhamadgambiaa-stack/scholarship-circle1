import { defineField, defineType } from "sanity";

export default defineType({
  name: "country",
  title: "Country",
  type: "document",

  groups: [
    { name: "content", title: "Page Content" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "flagImage",
      title: "Flag / Cover Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),

    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "A short introduction shown directly below the page title. Keep it specific to this country and useful to students.",
    }),

    defineField({
      name: "guideContent",
      title: "Country Guide / Editorial Notes",
      type: "array",
      group: "content",
      description:
        "Write a useful, human-edited guide for students considering scholarships in this country. Use specific and verifiable information, practical application context, funding patterns, study considerations, important cautions, or other details that genuinely help applicants. Avoid generic filler, exaggerated claims, keyword stuffing, or copying the same wording across different countries. Use headings only when they make the page easier to read.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
        },
      ],
    }),

    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed",
      type: "date",
      group: "content",
      description:
        "Update this when you have reviewed the guide and confirmed that its general information is still accurate.",
    }),

    defineField({
      name: "popular",
      title: "Show in Popular Destinations",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description:
        "Optional. Write a natural search title for this country page. Leave blank to use the automatic Scholarships in [Country] title.",
      validation: (Rule) =>
        Rule.max(65).warning(
          "Try to keep the SEO title at about 60 characters where possible."
        ),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "Optional. Summarize what students will find on this page in natural language. Be specific rather than repeating keywords.",
      validation: (Rule) =>
        Rule.max(165).warning(
          "Try to keep the SEO description around 150 to 160 characters."
        ),
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "flagImage",
    },
  },
});