import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getProductById } from "../../../../data/products";
import { createDuitkuInvoice } from "../../../../lib/duitku";

export async function POST(req) {
  try {
    const { productId, email, username } = await req.json();

    if (!productId || !email || !username) {
      return NextResponse.json(
        { error: "productId, email, dan username wajib diisi" },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const orderId = `PTERO-${Date.now()}`;

    const invoice = await createDuitkuInvoice({
      amount: product.price,
      orderId,
      productName: `Panel ${product.name}`,
      customerName: username,
      email
    });

    await prisma.order.create({
      data: {
        orderId,
        productId,
        email,
        username,
        amount: product.price,
        status: "PENDING",
        reference: invoice.reference || null
      }
    });

    return NextResponse.json({
      orderId,
      paymentUrl: invoice.paymentUrl,
      qrString: invoice.qrString,
      reference: invoice.reference
    });
  } catch (e) {
    console.error("create order error", e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
