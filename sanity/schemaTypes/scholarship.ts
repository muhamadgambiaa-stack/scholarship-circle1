import { defineField, defineType } from "sanity";

export default defineType({
  name: "scholarship",
  title: "Scholarship",
  type: "document",

  groups: [
    { name: "content", title: "Content" },
    { name: "details", title: "Scholarship Details" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Short Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Used in scholarship cards and Google search description.",
    }),

    defineField({
      name: "body",
      title: "Full Scholarship Article",
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
      name: "country",
      title: "Host Country",
      type: "reference",
      to: [{ type: "country" }],
      group: "details",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "details",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
    }),

    defineField({
      name: "university",
      title: "University",
      type: "string",
      group: "details",
    }),

    defineField({
      name: "provider",
      title: "Scholarship Provider",
      type: "string",
      group: "details",
    }),

    defineField({
      name: "degreeLevels",
      title: "Degree Levels",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      options: {
        layout: "grid",
        list: [
          { title: "Associate Degree", value: "associate" },
          { title: "Diploma", value: "diploma" },
          { title: "Bachelor's", value: "bachelors" },
          { title: "Master's", value: "masters" },
          { title: "MBA", value: "mba" },
          { title: "PhD", value: "phd" },
          { title: "Postdoctoral", value: "postdoctoral" },

          { title: "Non-Degree Program", value: "non-degree" },
          { title: "Certificate Program", value: "certificate" },
          { title: "Exchange Program", value: "exchange" },
          { title: "Internship", value: "internship" },
          { title: "Fellowship", value: "fellowship" },
          { title: "Competition", value: "competition" },
          { title: "Research Program", value: "research" },
          { title: "Summer School", value: "summer-school" },
          { title: "Workshop", value: "workshop" },
          { title: "Conference", value: "conference" },
          { title: "Training Program", value: "training" },
          { title: "Volunteer Program", value: "volunteer" },
        ],
      },
    }),

    defineField({
      name: "fundingType",
      title: "Funding Type",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Fully Funded", value: "fully-funded" },
          { title: "Partially Funded", value: "partially-funded" },
          { title: "Tuition Only", value: "tuition-only" },
          { title: "Fully Sponsored", value: "fully-sponsored" },
          { title: "Paid Program", value: "paid-program" },
          { title: "Free Program", value: "free-program" },
          { title: "Self Funded", value: "self-funded" },
          { title: "Stipend Available", value: "stipend" },
        ],
      },
    }),

    defineField({
      name: "eligibleCountries",
      title: "Eligible Countries",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "deadline",
      title: "Application Deadline",
      type: "date",
      group: "details",
    }),

    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "eligibility",
      title: "Eligibility Requirements",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "requiredDocuments",
      title: "Required Documents",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "applicationProcess",
      title: "Application Process",
      type: "array",
      group: "details",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "applicationLink",
      title: "Official Application Link",
      type: "url",
      group: "details",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "featured",
      title: "Feature on Homepage",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),

    defineField({
      name: "relatedScholarships",
      title: "Related Scholarships",
      type: "array",
      group: "details",
      of: [
        {
          type: "reference",
          to: [{ type: "scholarship" }],
        },
      ],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
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
      subtitle: "country.name",
    },
  },
});