import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { DEGREE_LEVEL_LABELS, FUNDING_TYPE_LABELS, type ScholarshipCard as ScholarshipCardType } from "@/types/scholarship";
import { deadlineStatus } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ShareButton from "@/components/ui/ShareButton";

export default function ScholarshipCard({ scholarship }: { scholarship: ScholarshipCardType }) {
  const img = urlForImage(scholarship.featuredImage)?.width(600).height(360).url();
  const deadline = deadlineStatus(scholarship.deadline);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/scholarships/${scholarship.slug}`} className="flex flex-1 flex-col">
        <div className="relative h-44 w-full overflow-hidden bg-navy-50">
          {img ? (
            <Image
              src={img}
              alt={scholarship.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-navy-300">No image</div>
          )}
          {scholarship.fundingType && (
            <span className="absolute left-3 top-3">
              <Badge tone="gold">{FUNDING_TYPE_LABELS[scholarship.fundingType] ?? scholarship.fundingType}</Badge>
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 font-serif text-lg font-semibold text-navy-900 group-hover:text-navy-700">
            {scholarship.title}
          </h3>
          <p className="mt-1 text-sm text-navy-500">
            {scholarship.country?.name}
            {scholarship.university ? ` · ${scholarship.university}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scholarship.degreeLevel && (
              <Badge tone="navy">{DEGREE_LEVEL_LABELS[scholarship.degreeLevel] ?? scholarship.degreeLevel}</Badge>
            )}
          </div>
          <p className={`mt-3 text-xs font-medium ${deadline.closed ? "text-red-500" : "text-navy-600"}`}>
            {deadline.label}
          </p>
        </div>
      </Link>
      <div className="border-t border-navy-100 p-4 pt-3">
        <ShareButton
          title={scholarship.title}
          description={scholarship.excerpt || scholarship.title}
          className="inline-flex w-full items-center justify-center rounded-md border border-navy-300 bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-gold-400"
          label="Share"
          url={`/scholarships/${scholarship.slug}`}
        />
      </div>
    </div>
  );
}
