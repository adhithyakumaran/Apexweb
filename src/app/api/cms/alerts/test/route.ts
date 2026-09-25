import { NextResponse } from "next/server";
import { sendTestAlert } from "@/lib/alerts/dispatch";
import { requireCmsAuth } from "@/lib/cms/api-auth";

export async function POST() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  try {
    const results = await sendTestAlert();
    return NextResponse.json({ ok: true, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Test failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
