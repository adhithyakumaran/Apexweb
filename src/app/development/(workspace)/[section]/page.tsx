import { notFound, redirect } from "next/navigation";
import { getHubData } from "@/lib/development/data";
import {
  ReportsContent,
  ProgressContent,
} from "@/components/development/content";
export default async function Section({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (["builds", "releases", "documents", "tasks"].includes(section))
    redirect("/development");
  if (section === "testing") redirect("/development/reports");
  if (!["reports", "progress"].includes(section)) notFound();
  const data = await getHubData();
  return section === "reports" ? (
    <ReportsContent data={data} />
  ) : (
    <ProgressContent data={data} />
  );
}
