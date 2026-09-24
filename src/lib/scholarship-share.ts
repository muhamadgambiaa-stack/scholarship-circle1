import {
  DEGREE_LEVEL_LABELS,
  type Scholarship,
} from "../types/scholarship";

export const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/Hs1ZTp2h1HQ4veII2Y879h?s=cl&p=i&mlu=4&ilr=4";

export const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029VbAizC41NCrYce9fJ03i";

export function shareText(value?: string): string {
  return (value ?? "")
    .replace(/[0-9#*]\uFE0F?\u20E3/gu, "")
    .replace(
      /[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}\uFE0F\u200D\u{E0020}-\u{E007F}]/gu,
      ""
    )
    .replace(/https?:\/\/\S+|www\.\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countryKey(value: string): string {
  return shareText(value)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const countryCodes = new Map<string, string>();
const regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

for (let first = 65; first <= 90; first++) {
  for (let second = 65; second <= 90; second++) {
    const code = String.fromCharCode(first, second);
    const name = regionNames.of(code);

    if (
      name &&
      name !== code &&
      !["EU", "UN", "ZZ"].includes(code)
    ) {
      const canonicalCode =
        new Intl.Locale(`und-${code}`).region ?? code;

      countryCodes.set(countryKey(name), canonicalCode);
      countryCodes.set(code.toLowerCase(), canonicalCode);
    }
  }
}

for (const [name, code] of Object.entries({
  usa: "US",
  uk: "GB",
  unitedstatesofamerica: "US",
  southkorea: "KR",
  northkorea: "KP",
  turkey: "TR",
  turkiye: "TR",
  czechrepublic: "CZ",
  ivorycoast: "CI",
  thegambia: "GM",
  russia: "RU",
  vietnam: "VN",
})) {
  countryCodes.set(name, code);
}

export function countryFlag(
  country?: Scholarship["country"]
): string {
  const code =
    countryCodes.get(countryKey(country?.name ?? "")) ??
    countryCodes.get(countryKey(country?.slug ?? ""));

  if (!code) return "";

  return [...code]
    .map((letter) =>
      String.fromCodePoint(127397 + letter.charCodeAt(0))
    )
    .join("");
}


function summarizeText(value?: string, maxLength = 220): string {
  const text = shareText(value);

  if (!text) return "";

  if (text.length <= maxLength) return text;

  const shortened = text.slice(0, maxLength);
  const lastSentence = shortened.lastIndexOf(".");

  return lastSentence > 80
    ? shortened.slice(0, lastSentence + 1)
    : `${shortened.trim()}...`;
}

function summarizeBenefit(value: string): string {
  const text = shareText(value)
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";

  if (/tuition fee coverage/i.test(text)) {
    return "Tuition fee coverage.";
  }

  if (
    /monthly living allowance/i.test(text) &&
    !/5,000,000/i.test(text)
  ) {
    return "Monthly living allowance.";
  }

  if (/monthly stipend of IDR 5,000,000/i.test(text)) {
    return "Monthly stipend: IDR 5,000,000.";
  }

  if (/UIII Student Dormitory/i.test(text)) {
    return "UIII Student Dormitory: IDR 1,000,000 monthly deduction.";
  }

  if (/round-trip economy-class airfare/i.test(text)) {
    return "Round-trip economy airfare may be provided.";
  }

  if (/student visa and legal stay permit/i.test(text)) {
    return "Student visa and legal stay permit support may be provided.";
  }

  if (/books, research or thesis-related expenses/i.test(text)) {
    return "Additional support for books, research and thesis expenses.";
  }

  return text
    .replace(/\s*[,.]\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}
function deadlineLabel(value?: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Not specified";
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return "Not specified";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function buildScholarshipShare(
  scholarship: Scholarship
): string {
  const title = [
    countryFlag(scholarship.country),
    shareText(scholarship.title),
  ]
    .filter(Boolean)
    .join(" ");

  // Always link to our article, not the external application.
  const articleUrl =
    "https://thescholarshipcircle.com/scholarships/" +
    encodeURIComponent(scholarship.slug);

  const description =
    summarizeText(scholarship.excerpt) ||
    summarizeText(scholarship.seoDescription);

  const benefits = (scholarship.benefits ?? [])
    .map(summarizeBenefit)
    .filter(Boolean);

  const categories = (scholarship.categories ?? [])
    .map((category) => shareText(category?.name))
    .filter(Boolean);

  const levels = (scholarship.degreeLevels ?? [])
    .map((level) =>
      shareText(DEGREE_LEVEL_LABELS[level] ?? level)
    )
    .filter(Boolean);

  const categoryLines = [
    ...new Set(categories.length ? categories : levels),
  ];

  return [
    `${title}\n${articleUrl}`,
    description,
    `Benefits:\n${
      benefits.length
        ? benefits.join("\n")
        : "See article for details"
    }`,
    `Category:\n${
      categoryLines.length
        ? categoryLines.join("\n")
        : "See article for details"
    }`,
    `Deadline: ${deadlineLabel(scholarship.deadline)}`,
    "Share this opportunity with your friends",
    `Join The Scholarship Circle WhatsApp Group:\n${WHATSAPP_GROUP_URL}`,
    `Follow The Scholarship Circle WhatsApp Channel:\n${WHATSAPP_CHANNEL_URL}`,
    "Source: The Scholarship Circle",
  ]
    .filter(Boolean)
    .join("\n\n");
}


