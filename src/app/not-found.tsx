import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="font-serif text-6xl font-bold text-navy-800">404</p>
      <h1 className="mt-4 text-xl font-semibold text-navy-900">Page not found</h1>
      <p className="mt-2 text-navy-500">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
