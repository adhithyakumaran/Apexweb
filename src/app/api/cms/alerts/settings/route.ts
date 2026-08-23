import { NextResponse } from "next/server";
import { getAlertSettings, saveAlertSettings, isResendConfigured, isTwilioConfigured } from "@/lib/alerts/settings";
import { requireCmsAuth } from "@/lib/cms/api-auth";

export async function GET() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const settings = await getAlertSettings();
  return NextResponse.json({
    settings,
    resendConfigured: isResendConfigured(),
    twilioConfigured: isTwilioConfigured(),
  });
}

export async function PUT(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const settings = await saveAlertSettings(body);
    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
