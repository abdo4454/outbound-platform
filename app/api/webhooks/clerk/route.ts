import { NextResponse } from "next/server";

// Clerk is not used. This stub prevents 404s from any cached webhook deliveries.
export async function POST() {
  return NextResponse.json({ received: true });
}
