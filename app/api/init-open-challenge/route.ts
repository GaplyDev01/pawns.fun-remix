import { NextResponse } from "next/server"

export async function GET() {
  // This route is kept for backward compatibility
  // but it doesn't do anything anymore since we've changed our approach
  return NextResponse.json({ success: true, message: "No initialization needed" })
}
