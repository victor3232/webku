"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "../data/products";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productIdFromQuery = searchParams.get("productId") || "1gb";

  const [productId, setProductId] = useState(productIdFromQuery);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0],
    [productId]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setInvoice(null);

    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email, username })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat order");
      }

      setInvoice(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  const qrUrl = invoice?.qrString
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        invoice.qrString
      )}`
    : null;

  return (
    <main>
      <div className="card">
        <h2>Checkout - QRIS Payment</h2>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Ringkasan Order
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <span className="badge">Paket</span>{" "}
          <strong>{product ? `Panel ${product.name}` : "-"}</strong>
        </p>
        <p style={{ marginTop: "0.2rem", color: "#eab308" }}>
          Harga: Rp {product?.price?.toLocaleString("id-ID")}
        </p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div>
          <label className="label">Pilih Paket</label>
          <select
            className="select"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - Rp {p.price.toLocaleString("id-ID")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Username Panel</label>
          <input
            className="input"
            placeholder="misal: picung"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Email (untuk menerima akun)</label>
          <input
            className="input"
            type="email"
            placeholder="email@contoh.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Konfirmasi Bayaran Anda"}
        </button>

        {error && (
          <p style={{ color: "#f97373", marginTop: "0.75rem" }}>{error}</p>
        )}
      </form>

      {invoice && (
        <div className="card">
          <h3>Invoice Pembayaran</h3>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
            ID Order: <code>{invoice.orderId}</code>
          </p>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
            ID Transaksi (Reference): <code>{invoice.reference}</code>
          </p>
          {qrUrl && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ fontSize: "0.9rem" }}>QRIS Code:</p>
              <img src={qrUrl} alt="QRIS Payment" />
            </div>
          )}
          <div style={{ marginTop: "1rem" }}>
            <a className="button secondary" href={invoice.paymentUrl} target="_blank">
              Bayar di Website Duitku
            </a>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.75rem" }}>
            Simpan ID Order untuk mengecek status manual jika diperlukan.
          </p>
        </div>
      )}
    </main>
  );
}
