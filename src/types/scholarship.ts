import type { Image, PortableTextBlock } from "sanity";

export interface CountryRef {
  name: string;
  slug: string;
  flagImage?: Image;
  description?: string;
}

export interface CategoryRef {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface ScholarshipCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: Image;
  degreeLevel?: string;
  fundingType?: string;
  deadline?: string;
  university?: string;
  provider?: string;
  publishedAt?: string;
  country?: CountryRef;
}

export interface Scholarship extends ScholarshipCard {
  body?: PortableTextBlock[];
  categories?: CategoryRef[];
  eligibleCountries?: string[];
  benefits?: string[];
  eligibility?: string[];
  requiredDocuments?: string[];
  applicationProcess?: PortableTextBlock[];
  applicationLink: string;
  featured?: boolean;
  relatedScholarships?: ScholarshipCard[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: Image;
  body?: PortableTextBlock[];
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface HomepageData {
  featured: ScholarshipCard[];
  latest: ScholarshipCard[];
  closingSoon: ScholarshipCard[];
  categories: CategoryRef[];
  popularCountries: CountryRef[];
}

export const DEGREE_LEVEL_LABELS: Record<string, string> = {
  bachelors: "Bachelor's",
  masters: "Master's",
  phd: "PhD",
  fellowship: "Fellowship",
  internship: "Internship",
  exchange: "Exchange Program",
  competition: "Competition",
};

export const FUNDING_TYPE_LABELS: Record<string, string> = {
  "fully-funded": "Fully Funded",
  "partially-funded": "Partially Funded",
  "tuition-only": "Tuition Only",
};
