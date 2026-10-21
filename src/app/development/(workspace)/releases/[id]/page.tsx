import { notFound } from "next/navigation";
import { z } from "zod";
import { getHubData } from "@/lib/development/data";
import { ReleaseDetail } from "@/components/development/content";
export default async function ReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const data = await getHubData();
  const release = data.builds.find((release) => release.id === id);
  if (!release) notFound();
  return <ReleaseDetail release={release} data={data} />;
}
