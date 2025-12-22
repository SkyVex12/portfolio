import Link from "next/link";

export const metadata = {
  title: "Terms | Goran",
  description: "Terms for Goran's portfolio website.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/"
          className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
        >
          ← Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Terms</h1>
        <p className="mt-4 text-sm leading-relaxed opacity-85">
          This website is a personal portfolio showcasing example projects and technical experiments.
        </p>

        <h2 className="mt-8 text-lg font-semibold">No guarantees</h2>
        <p className="mt-3 text-sm leading-relaxed opacity-85">
          Content on this site is provided for informational purposes only. No guarantees, warranties, or
          business outcomes are implied.
        </p>

        <h2 className="mt-8 text-lg font-semibold">Third-party links</h2>
        <p className="mt-3 text-sm leading-relaxed opacity-85">
          This site may link to third-party websites (for example, GitHub). I do not control those sites and
          am not responsible for their content or practices.
        </p>

        <h2 className="mt-8 text-lg font-semibold">Changes</h2>
        <p className="mt-3 text-sm leading-relaxed opacity-85">
          These terms may be updated occasionally to reflect changes in the website.
        </p>
      </div>
    </main>
  );
}
