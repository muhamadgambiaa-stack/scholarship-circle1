import { defineField, defineType } from "sanity";

export const ORGANIZATION_TYPES = [
  "University",
  "Scholarship provider",
  "NGO / non-profit",
  "Government body",
  "Private company",
  "Other",
] as const;

export const PARTNERSHIP_STATUSES = [
  "New",
  "Reviewing",
  "In discussion",
  "Approved",
  "Rejected",
] as const;

export default defineType({
  name: "partnershipApplication",
  title: "Partnership Application",
  type: "document",
  fields: [
    defineField({
      name: "organizationName",
      title: "Organization / university name",
      type: "string",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "organizationType",
      title: "Organization type",
      type: "string",
      options: { list: [...ORGANIZATION_TYPES] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "contactName",
      title: "Contact person name",
      type: "string",
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: "contactRole",
      title: "Contact person role / title (optional)",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (Rule) => Rule.required().email().max(200),
    }),
    defineField({
      name: "phone",
      title: "Phone number (optional)",
      type: "string",
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: "publishRequest",
      title: "What would you like us to publish?",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required().min(30).max(5000),
    }),
    defineField({
      name: "scholarshipLink",
      title: "Link to the scholarship / program page (optional)",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "deadline",
      title: "Deadline for applicants (optional)",
      type: "date",
    }),
    defineField({
      name: "additionalInfo",
      title: "Anything else we should know? (optional)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(3000),
    }),
    defineField({
      name: "status",
      title: "Application status",
      type: "string",
      options: {
        list: [...PARTNERSHIP_STATUSES],
        layout: "radio",
      },
      initialValue: "New",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "reviewedAt",
      title: "Last reviewed at",
      type: "datetime",
      description: "Optional. Set when you have finished a review pass.",
    }),
    defineField({
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 5,
      description:
        "Private. Never shown on the public website. Only visible to admins in the Studio.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Status, then newest",
      name: "statusThenNewest",
      by: [
        { field: "status", direction: "asc" },
        { field: "submittedAt", direction: "desc" },
      ],
    },
    {
      title: "Organization (A-Z)",
      name: "organizationAsc",
      by: [{ field: "organizationName", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "organizationName",
      status: "status",
      submittedAt: "submittedAt",
      type: "organizationType",
    },
    prepare({ title, status, submittedAt, type }) {
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "no date";
      return {
        title: title || "Unnamed organization",
        subtitle: status + " | " + (type || "-") + " | " + date,
      };
    },
  },
});
