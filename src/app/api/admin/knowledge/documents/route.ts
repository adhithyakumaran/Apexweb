import { NextResponse } from "next/server";

/**
 * Admin knowledge document API (contract only).
 *
 * Production requires ADMIN_API_SECRET, object storage, and embedding pipeline.
 */

function verifyAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) {
    return process.env.NODE_ENV === "development";
  }
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    documents: [],
    message:
      "Document storage not configured. Connect object storage and embedding pipeline for production.",
  });
}

export async function POST(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    {
      error: "Upload pipeline not configured",
      hint: "Implement DocumentProcessor and secure storage behind ADMIN_API_SECRET",
    },
    { status: 501 }
  );
}
