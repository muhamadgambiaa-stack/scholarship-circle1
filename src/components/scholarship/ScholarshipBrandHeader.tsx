import Image from "next/image";
import type { ReactNode } from "react";

export default function ScholarshipBrandHeader({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <div className="border-b-2 border-gold-500 bg-navy-950 px-4 py-5 sm:px-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-1">
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </span>
        <span className="min-w-0 text-sm font-semibold leading-5 text-white sm:text-base">
          The Scholarship Circle
        </span>
      </div>
      {children && (
        <div className="mt-3 flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
