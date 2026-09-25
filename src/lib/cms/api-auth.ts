import { NextResponse } from "next/server";
import { isCmsAuthenticated } from "@/lib/cms/auth";

export async function requireCmsAuth() {
  const authed = await isCmsAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
