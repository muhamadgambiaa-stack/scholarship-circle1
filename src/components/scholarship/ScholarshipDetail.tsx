import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { CalendarClock, CheckCircle2, ExternalLink, FileText, GraduationCap } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import { DEGREE_LEVEL_LABELS, FUNDING_TYPE_LABELS, type Scholarship } from "@/types/scholarship";
import { formatDate, deadlineStatus } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ShareButton from "@/components/ui/ShareButton";
import ScholarshipCard from "./ScholarshipCard";

export default function ScholarshipDetail({ scholarship }: { scholarship: Scholarship }) {
  const img = urlForImage(scholarship.featuredImage)?.width(1200).height(600).url();
  const deadline = deadlineStatus(scholarship.deadline);

  return (
    <article className="container-page grid grid-cols-1 gap-10 py-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {img && (
          <div className="relative mb-6 h-72 w-full overflow-hidden rounded-lg bg-navy-50 sm:h-96">
            <Image src={img} alt={scholarship.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {scholarship.fundingType && (
            <Badge tone="gold">{FUNDING_TYPE_LABELS[scholarship.fundingType] ?? scholarship.fundingType}</Badge>
          )}
          {scholarship.degreeLevel && (
            <Badge tone="navy">{DEGREE_LEVEL_LABELS[scholarship.degreeLevel] ?? scholarship.degreeLevel}</Badge>
          )}
          {scholarship.categories?.map((c) => (
            <Badge key={c.slug} tone="outline">{c.name}</Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">{scholarship.title}</h1>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <ShareButton
            title={scholarship.title}
            description={scholarship.excerpt || scholarship.seoDescription || scholarship.title}
            className="inline-flex items-center justify-center rounded-md border border-navy-300 bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-gold-400"
            label="Share this scholarship"
          />
        </div>
        <p className="mt-2 text-navy-500">
          {scholarship.country?.name}
          {scholarship.university ? ` · ${scholarship.university}` : ""}
          {scholarship.provider ? ` · ${scholarship.provider}` : ""}
        </p>

        {scholarship.body && (
          <div className="prose prose-navy mt-8 max-w-none prose-headings:font-serif prose-a:text-navy-700">
            <PortableText value={scholarship.body} />
          </div>
        )}

        {!!scholarship.benefits?.length && (
          <DetailList icon={<CheckCircle2 size={18} />} title="Benefits" items={scholarship.benefits} />
        )}
        {!!scholarship.eligibility?.length && (
          <DetailList icon={<GraduationCap size={18} />} title="Eligibility Requirements" items={scholarship.eligibility} />
        )}
        {!!scholarship.requiredDocuments?.length && (
          <DetailList icon={<FileText size={18} />} title="Required Documents" items={scholarship.requiredDocuments} />
        )}

        {scholarship.applicationProcess && (
          <div className="mt-8">
            <h2 className="mb-3 font-serif text-xl font-bold text-navy-900">Application Process</h2>
            <div className="prose prose-navy max-w-none">
              <PortableText value={scholarship.applicationProcess} />
            </div>
          </div>
        )}

        {!!scholarship.relatedScholarships?.length && (
          <div className="mt-12">
            <h2 className="mb-6 font-serif text-xl font-bold text-navy-900">Related Scholarships</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {scholarship.relatedScholarships.map((s) => (
                <ScholarshipCard key={s._id} scholarship={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-navy-100 bg-navy-50/60 p-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-navy-900">Key Information</h2>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Country" value={scholarship.country?.name} />
            <InfoRow label="University" value={scholarship.university} />
            <InfoRow label="Provider" value={scholarship.provider} />
            <InfoRow
              label="Degree Level"
              value={scholarship.degreeLevel ? DEGREE_LEVEL_LABELS[scholarship.degreeLevel] : undefined}
            />
            <InfoRow
              label="Funding Type"
              value={scholarship.fundingType ? FUNDING_TYPE_LABELS[scholarship.fundingType] : undefined}
            />
            <InfoRow label="Eligible Countries" value={scholarship.eligibleCountries?.join(", ")} />
            <InfoRow label="Deadline" value={scholarship.deadline ? formatDate(scholarship.deadline) : undefined} />
          </dl>

          <div className={`mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${deadline.closed ? "bg-red-50 text-red-600" : "bg-white text-navy-700"}`}>
            <CalendarClock size={16} />
            {deadline.label}
          </div>

          <a
            href={scholarship.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full"
          >
            Apply Now <ExternalLink size={16} className="ml-2" />
          </a>
        </div>
      </aside>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-navy-100 pb-2">
      <dt className="text-navy-500">{label}</dt>
      <dd className="text-right font-medium text-navy-900">{value}</dd>
    </div>
  );
}

function DetailList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
        {icon} {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-navy-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
