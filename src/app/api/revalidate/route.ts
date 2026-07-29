import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

type SanityDocumentLike = Record<string, unknown>;

type RevalidatedDocument = {
  type?: string;
  slug?: string;
};

function getDocumentSlug(document: SanityDocumentLike | undefined): string | undefined {
  const slug = document?.slug;

  if (typeof slug === "string") {
    return slug;
  }

  if (slug && typeof slug === "object" && "current" in slug && typeof (slug as { current?: unknown }).current === "string") {
    return (slug as { current: string }).current;
  }

  return undefined;
}

function getDocumentType(document: SanityDocumentLike | undefined): string | undefined {
  const type = document?._type;
  if (typeof type === "string") {
    return type;
  }

  const documentType = document?.documentType;
  return typeof documentType === "string" ? documentType : undefined;
}

function getPathsToRevalidate(type: string | undefined, slug: string | undefined): string[] {
  const paths = new Set<string>(["/", "/scholarships", "/categories", "/countries", "/blog"]);

  if (type === "scholarship") {
    paths.add("/scholarships");
    if (slug) {
      paths.add(`/scholarships/${slug}`);
    }
  }

  if (type === "post") {
    paths.add("/blog");
    if (slug) {
      paths.add(`/blog/${slug}`);
    }
  }

  if (type === "category") {
    paths.add("/categories");
    if (slug) {
      paths.add(`/categories/${slug}`);
    }
  }

  if (type === "country") {
    paths.add("/countries");
    if (slug) {
      paths.add(`/countries/${slug}`);
    }
  }

  return Array.from(paths);
}

async function getDocumentDetails(body: SanityDocumentLike): Promise<RevalidatedDocument> {
  const document = body.document as SanityDocumentLike | undefined;
  const incomingDocument = (document ?? body.result ?? body) as SanityDocumentLike | undefined;

  const type = getDocumentType(incomingDocument ?? body);
  const slug = getDocumentSlug(incomingDocument ?? body);

  if (slug || !body.documentId || !type) {
    return { type, slug };
  }

  const documentId = typeof body.documentId === "string" ? body.documentId : undefined;
  if (!documentId) {
    return { type, slug };
  }

  const fetchedDocument = await client
    .fetch<SanityDocumentLike | null>(`*[_id == $documentId || _id == "drafts." + $documentId][0]{_id, _type, slug}`, {
      documentId,
    })
    .catch(() => null);

  return {
    type: getDocumentType(fetchedDocument ?? incomingDocument ?? body) ?? type,
    slug: getDocumentSlug(fetchedDocument ?? incomingDocument ?? body) ?? slug,
  };
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedHeader = revalidateSecret ? `Bearer ${revalidateSecret}` : null;

  if (expectedHeader && authHeader !== expectedHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const document = body as SanityDocumentLike;
  const details = await getDocumentDetails(document);
  const paths = getPathsToRevalidate(details.type, details.slug);

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    documentType: details.type || "unknown",
    paths,
  });
}
