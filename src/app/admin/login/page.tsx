import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import {
  FileText,
  Image,
  LayoutTemplate,
  PenLine,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CMS Login",
  robots: { index: false, follow: false },
};

const cmsFeatures = [
  {
    icon: LayoutTemplate,
    title: "5 article templates",
    description: "Text, image + text, media kits, case studies, and insight briefs.",
  },
  {
    icon: PenLine,
    title: "Draft & publish workflow",
    description: "Write, preview, and publish articles when they are ready.",
  },
  {
    icon: Image,
    title: "Hero images & files",
    description: "Upload cover images and downloadable assets via Cloudflare R2.",
  },
  {
    icon: FileText,
    title: "SEO-ready articles",
    description: "Each article gets its own URL, metadata, and structured content.",
  },
  {
    icon: Trash2,
    title: "Full article control",
    description: "Edit, update, or delete any article from one dashboard.",
  },
  {
    icon: Shield,
    title: "Private & secure",
    description: "Password-protected admin area, not indexed by search engines.",
  },
];

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Features — black (left on desktop) */}
      <section className="relative flex flex-col justify-between bg-black px-6 py-12 text-white sm:px-10 lg:w-1/2 lg:px-16 lg:py-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_55%)]" />

        <div className="relative">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-orange">
            What you can do
          </p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Manage your entire knowledge hub from one place.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-neutral-400">
            Create professional articles, case studies, and insights that appear on your live site
            in real time.
          </p>
        </div>

        <ul className="relative mt-10 space-y-5 lg:mt-12">
          {cmsFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-brand-orange">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="mt-0.5 text-sm text-neutral-400">{feature.description}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="relative mt-8 flex items-center gap-2 text-xs text-neutral-500 lg:mt-10">
          <Upload className="size-3.5 text-brand-orange" />
          Changes publish to your live site immediately after saving.
        </div>
      </section>

      {/* Sign in — white (right on desktop) */}
      <section className="flex w-full flex-col justify-center bg-white px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Apex Node · Content Studio
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black">Sign in</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Authorized editors only. Your session ends when you close the browser.
          </p>

          <div className="mt-10">
            <LoginForm nextPath={next || "/admin"} />
          </div>

          <p className="mt-8 text-xs text-neutral-400">
            This area is private. Contact your site administrator if you need access.
          </p>
        </div>
      </section>
    </main>
  );
}
