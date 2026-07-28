import { groq } from "next-sanity";

// Fragments
const scholarshipCardFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  featuredImage,
  degreeLevel,
  fundingType,
  deadline,
  university,
  provider,
  publishedAt,
  "country": country->{name, "slug": slug.current}
`;

export const homepageQuery = groq`{
  "featured": *[_type == "scholarship" && featured == true] | order(publishedAt desc) [0...6] { ${scholarshipCardFields} },
  "latest": *[_type == "scholarship"] | order(publishedAt desc) [0...8] { ${scholarshipCardFields} },
  "closingSoon": *[_type == "scholarship" && defined(deadline) && deadline >= now()] | order(deadline asc) [0...6] { ${scholarshipCardFields} },
  "categories": *[_type == "category"] | order(name asc) { _id, name, "slug": slug.current, icon },
  "popularCountries": *[_type == "country" && popular == true] | order(name asc) { _id, name, "slug": slug.current, flagImage }
}`;

export const allScholarshipsQuery = groq`
  *[_type == "scholarship"] | order(publishedAt desc) { ${scholarshipCardFields} }
`;

export const scholarshipBySlugQuery = groq`
  *[_type == "scholarship" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    "country": country->{name, "slug": slug.current},
    "categories": categories[]->{name, "slug": slug.current},
    "relatedScholarships": relatedScholarships[]->{ ${scholarshipCardFields} }
  }
`;

export const allScholarshipSlugsQuery = groq`
  *[_type == "scholarship" && defined(slug.current)][].slug.current
`;

export const scholarshipsByCountryQuery = groq`
  *[_type == "scholarship" && country->slug.current == $slug] | order(publishedAt desc) { ${scholarshipCardFields} }
`;

export const scholarshipsByCategoryQuery = groq`
  *[_type == "scholarship" && $slug in categories[]->slug.current] | order(publishedAt desc) { ${scholarshipCardFields} }
`;

export const allCountriesQuery = groq`
  *[_type == "country"] | order(name asc) { _id, name, "slug": slug.current, flagImage, description }
`;

export const countryBySlugQuery = groq`
  *[_type == "country" && slug.current == $slug][0]{ _id, name, "slug": slug.current, flagImage, description }
`;

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) { _id, name, "slug": slug.current, description, icon }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{ _id, name, "slug": slug.current, description, icon }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, "slug": slug.current, excerpt, featuredImage, publishedAt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ..., "slug": slug.current
  }
`;

// Simple multi-field search across title, university, provider, country name
export const searchScholarshipsQuery = groq`
  *[_type == "scholarship" && (
    title match $term + "*" ||
    university match $term + "*" ||
    provider match $term + "*" ||
    country->name match $term + "*"
  )] | order(publishedAt desc) [0...20] { ${scholarshipCardFields} }
`;
