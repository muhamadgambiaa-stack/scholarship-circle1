// Sanity document types that hold Get Involved applications.
// Open sanity/schemaTypes and make sure these match your real type names
// (the "name" field of each application schema).
export const APPLICATION_TYPES = ["volunteerApplication", "partnershipApplication"];

export const SITE_NAME = "The Scholarship Circle";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://thescholarshipcircle.com").replace(/\/$/, "");

export const SUBMISSION_CATEGORIES = [
  { title: "Scholarship opportunity", value: "scholarship-opportunity" },
  { title: "Application tip", value: "tip" },
  { title: "Article / guide", value: "article" },
];
