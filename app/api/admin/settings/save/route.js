import { NextResponse } from "next/server";
import { setPteroSettings } from "../../../../../lib/settings";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req) {
  try {
    const { password, pteroUrl, pteroApiKey } = await req.json();

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD belum di-set di environment." },
        { status: 500 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Password admin salah." },
        { status: 401 }
      );
    }

    await setPteroSettings({
      url: pteroUrl,
      apiKey: pteroApiKey
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("admin save settings error", e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
