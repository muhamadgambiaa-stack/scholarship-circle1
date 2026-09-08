import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
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
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "A concise introduction explaining what this scholarship category covers.",
    }),

    defineField({
      name: "guideContent",
      title: "Category Guide / Editorial Notes",
      type: "array",
      group: "content",
      description:
        "Add genuinely useful guidance about this scholarship category. Explain what applicants can normally expect, who the opportunities are relevant to, common funding arrangements, application considerations, and important differences where appropriate. Keep the writing specific and editorial. Avoid generic filler or repeating the same wording across categories.",
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
        "Update this when the category guide has been checked and its general guidance is still accurate.",
    }),

    defineField({
      name: "icon",
      title: "Icon name (lucide-react)",
      type: "string",
      group: "content",
      description: "For example: graduation-cap or book-open.",
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description:
        "Optional. Leave blank to use the automatic category title.",
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
        "Optional. Write a concise and specific summary of this category for search results.",
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
    },
  },
});