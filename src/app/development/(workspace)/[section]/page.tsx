import { notFound, redirect } from "next/navigation";
export default async function LegacySection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (["reports", "testing"].includes(section))
    redirect("/development#reports");
  if (section === "progress") redirect("/development#progress");
  if (["builds", "releases", "documents", "tasks"].includes(section))
    redirect("/development#releases");
  notFound();
}
