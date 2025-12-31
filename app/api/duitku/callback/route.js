import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getProductById } from "../../../../data/products";
import { createPteroServer } from "../../../../lib/pterodactyl";

// Format callback sesuaikan dengan dokumen Duitku, di sini kerangka umum
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Duitku callback:", body);

    const orderId = body.merchantOrderId || body.merchantOrderId;
    const resultCode = body.resultCode || body.statusCode;

    if (!orderId) {
      return NextResponse.json({ error: "merchantOrderId kosong" }, { status: 400 });
    }

    // TODO: verifikasi signature callback Duitku di sini bila diperlukan

    const order = await prisma.order.findUnique({
      where: { orderId }
    });

    if (!order) {
      return NextResponse.json({ success: true }); // diam saja kalau order tidak ada
    }

    if (resultCode === "00" && order.status !== "PAID") {
      const product = getProductById(order.productId);
      if (product) {
        try {
          const server = await createPteroServer({
            product,
            username: order.username,
            email: order.email
          });

          await prisma.order.update({
            where: { orderId },
            data: {
              status: "PAID"
            }
          });

          console.log("Panel created from callback:", server?.attributes?.identifier);
        } catch (e) {
          console.error("Error create panel from callback:", e);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("callback error", e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
