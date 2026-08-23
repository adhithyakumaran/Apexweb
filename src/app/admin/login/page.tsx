import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/navigation/logo";
import {
  FileText,
  Image,
  LayoutTemplate,
  PenLine,
  Shield,
  Trash2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CMS Login",
  robots: { index: false, follow: false },
};

const cmsFeatures = [
  {
    icon: LayoutTemplate,
    title: "Five professional templates",
    description: "Text, image + text, media kits, case studies, and insight briefs.",
  },
  {
    icon: PenLine,
    title: "Draft and publish workflow",
    description: "Compose privately, then publish to your live knowledge hub.",
  },
  {
    icon: Image,
    title: "Media and assets",
    description: "Upload cover images and downloadable files via Cloudflare R2.",
  },
  {
    icon: FileText,
    title: "SEO-ready publishing",
    description: "Every article ships with its own URL, metadata, and structure.",
  },
  {
    icon: Trash2,
    title: "Full editorial control",
    description: "Edit, update, or remove content from a single workspace.",
  },
  {
    icon: Shield,
    title: "Private and secure",
    description: "Password-protected admin area, excluded from search indexing.",
  },
];

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#09090b] px-6 py-12 text-white sm:px-10 lg:w-[52%] lg:px-16 lg:py-16 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]" />

        <div className="relative">
          <Logo href={false} variant="light" size="md" />
          <h2 className="mt-10 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Enterprise content management for your knowledge hub.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
            Publish articles, case studies, and insights to your live site with a workspace built
            for professional teams.
          </p>
        </div>

        <ul className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-1 xl:grid-cols-2">
          {cmsFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="flex gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-brand-orange">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex w-full flex-col justify-center bg-[#f7f7f8] px-6 py-12 sm:px-10 lg:w-[48%] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-10">
          <Logo href={false} size="sm" />
          <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Content Studio
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
            Sign in to Content Studio
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            Authorized editors only. Your session ends when you close the browser.
          </p>

          <div className="mt-8">
            <LoginForm nextPath={next || "/admin"} />
          </div>

          <p className="mt-8 border-t border-neutral-100 pt-6 text-xs leading-relaxed text-neutral-400">
            This workspace is private and not indexed by search engines. Contact your site
            administrator if you need access.
          </p>
        </div>
      </section>
    </main>
  );
}
