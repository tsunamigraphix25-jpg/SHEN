import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";

export default function SubmitPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-shen-gray-100 p-8 md:p-10 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl md:text-4xl font-bold text-shen-gray-900 mb-3">Admin-Only Publishing</h1>
          <p className="text-shen-gray-600 mb-6 max-w-2xl mx-auto">
            This SHEN blog is managed through the admin dashboard only. Ordinary users do not submit content publicly here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/admin"
              className="px-6 py-3 bg-gradient-to-r from-shen-primary to-shen-accent text-white font-semibold rounded-lg"
            >
              Open Admin Login
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-shen-gray-200 text-shen-gray-700 font-semibold rounded-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
