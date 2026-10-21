import { notFound, redirect } from "next/navigation";
import { z } from "zod";
export default async function LegacyRelease({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  redirect(`/development#release-${id}`);
}
