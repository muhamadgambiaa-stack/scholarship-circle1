import { defineField, defineType } from "sanity";

export default defineType({
  name: "volunteerSubmission",
  title: "Volunteer Submission",
  type: "document",
  description:
    "Content sent in by volunteers. It arrives as a DRAFT. Review it, then press Publish to approve it, or delete it to reject it. Use 'Review note' to leave feedback the volunteer will see.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required().max(150) }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Scholarship opportunity", value: "scholarship-opportunity" },
          { title: "Application tip", value: "tip" },
          { title: "Article / guide", value: "article" },
        ],
      },
    }),
    defineField({ name: "link", title: "Official link", type: "url" }),
    defineField({ name: "body", title: "Content", type: "text", rows: 14 }),
    defineField({ name: "reviewNote", title: "Review note (shown to the volunteer)", type: "text", rows: 3 }),
    defineField({ name: "volunteerName", title: "Volunteer", type: "string", readOnly: true }),
    defineField({ name: "volunteerId", title: "Volunteer ID", type: "string", readOnly: true }),
  ],
  preview: { select: { title: "title", subtitle: "volunteerName" } },
});
