import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { checkDuitkuStatus } from "../../../../lib/duitku";
import { getProductById } from "../../../../data/products";
import { createPteroServer } from "../../../../lib/pterodactyl";

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId wajib diisi" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderId }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    const status = await checkDuitkuStatus(orderId);

    // jika baru sukses dan status di DB masih pending, buatkan panel
    if (status.statusCode === "00" && order.status !== "PAID") {
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

          status.pteroServer = server;
        } catch (e) {
          console.error("Error membuat panel:", e);
          // jangan throw, tetap balikan status duitku
        }
      }
    }

    return NextResponse.json(status);
  } catch (e) {
    console.error("check status error", e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
