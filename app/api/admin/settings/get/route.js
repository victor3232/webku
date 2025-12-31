import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    const urlSetting = await prisma.setting.findUnique({
      where: { key: "ptero_url" }
    }).catch(() => null);

    return NextResponse.json({
      pteroUrl: urlSetting?.value || process.env.PTERO_URL || ""
    });
  } catch (e) {
    console.error("admin get settings error", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
