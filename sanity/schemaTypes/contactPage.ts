import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",

  groups: [
    { name: "content", title: "Contact Information" },
    { name: "social", title: "Social & Communication" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      group: "content",
      initialValue: "Contact The Scholarship Circle",
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
      name: "email",
      title: "Email Address",
      type: "string",
      group: "content",
    }),

    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      group: "content",
    }),

    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      group: "content",
    }),

    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      group: "content",
    }),

    defineField({
      name: "contactFormEnabled",
      title: "Enable Contact Form",
      type: "boolean",
      group: "content",
      initialValue: true,
    }),

    defineField({
      name: "whatsappChannel",
      title: "Official WhatsApp Channel",
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
    },
  },
});