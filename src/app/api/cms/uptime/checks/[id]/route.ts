import { NextResponse } from "next/server";
import { deleteUptimeCheck } from "@/lib/uptime/checks";
import { requireCmsAuth } from "@/lib/cms/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const { id } = await context.params;
  await deleteUptimeCheck(Number(id));
  return NextResponse.json({ ok: true });
}
