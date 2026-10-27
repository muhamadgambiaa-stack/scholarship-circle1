// Sanity document types that hold Get Involved applications.
// These matched your project when it was tested (5 volunteer applications were found).
export const APPLICATION_TYPES = ["volunteerApplication", "partnershipApplication"];

export const SITE_NAME = "The Scholarship Circle";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://thescholarshipcircle.com").replace(/\/$/, "");

// What a volunteer can submit. Both map straight onto your real Sanity document types.
export const SUBMISSION_TYPES = [
  { value: "scholarship", title: "Scholarship" },
  { value: "post", title: "Application tip or article (blog post)" },
] as const;
export type SubmissionType = (typeof SUBMISSION_TYPES)[number]["value"];

// Copied from sanity/schemaTypes/scholarship.ts. If you change the lists there, change them here too.
export const DEGREE_LEVELS = [
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
];

export const FUNDING_TYPES = [
  { title: "Fully Funded", value: "fully-funded" },
  { title: "Partially Funded", value: "partially-funded" },
  { title: "Tuition Only", value: "tuition-only" },
  { title: "Fully Sponsored", value: "fully-sponsored" },
  { title: "Paid Program", value: "paid-program" },
  { title: "Free Program", value: "free-program" },
  { title: "Self Funded", value: "self-funded" },
  { title: "Stipend Available", value: "stipend" },
];

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies above ~4.5 MB
export const MAX_SOURCE_LINKS = 4;
