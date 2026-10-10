import { defineField, defineType } from "sanity";

export const CONTRIBUTION_AREAS = [
  "Scholarship research and verification",
  "Writing and editing scholarship articles",
  "Social media and content creation",
  "Graphic design and visual content",
  "Website and technology",
  "Community management",
  "Marketing and growth",
  "Partnerships and outreach",
  "Other",
] as const;

export const AVAILABILITY_OPTIONS = [
  "A few hours per week",
  "5-10 hours per week",
  "More than 10 hours per week",
  "Flexible, depending on the task",
] as const;

export const APPLICATION_STATUSES = [
  "New",
  "Reviewing",
  "Shortlisted",
  "Accepted",
  "Rejected",
] as const;

export const ROLE_OPTIONS = [
  "Student",
  "Graduate",
  "Professional",
  "Other",
] as const;

export default defineType({
  name: "volunteerApplication",
  title: "Volunteer Application",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full name",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      validation: (Rule) => Rule.required().email().max(200),
    }),
    defineField({
      name: "country",
      title: "Country of residence",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "currentRole",
      title: "Current role",
      type: "string",
      options: { list: [...ROLE_OPTIONS] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "skills",
      title: "Skills, experience, or knowledge to contribute",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required().min(20).max(3000),
    }),
    defineField({
      name: "motivation",
      title: "Why do you want to volunteer?",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(20).max(3000),
    }),
    defineField({
      name: "ideas",
      title: "Ideas for improving or growing The Scholarship Circle",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(3000),
    }),
    defineField({
      name: "contributions",
      title: "Areas you would like to contribute to",
      type: "array",
      of: [{ type: "string" }],
      options: { list: [...CONTRIBUTION_AREAS] },
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: "availability",
      title: "How much time can you contribute?",
      type: "string",
      options: { list: [...AVAILABILITY_OPTIONS] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "additionalInfo",
      title: "Additional information (optional)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(2000),
    }),
    defineField({
      name: "status",
      title: "Application status",
      type: "string",
      options: { list: [...APPLICATION_STATUSES], layout: "radio" },
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
      title: "Full name (A-Z)",
      name: "fullNameAsc",
      by: [{ field: "fullName", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "fullName",
      status: "status",
      submittedAt: "submittedAt",
      role: "currentRole",
    },
    prepare({ title, status, submittedAt, role }) {
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "no date";
      return {
        title: title || "Unnamed applicant",
        subtitle: status + " | " + (role || "-") + " | " + date,
      };
    },
  },
});
