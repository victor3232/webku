"use client";

import { useState } from "react";

export default function StatusPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/order/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal cek status");
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  const statusCode = result?.statusCode;
  let statusText = "";
  if (statusCode === "00") statusText = "Berhasil (PAID)";
  else if (statusCode === "01") statusText = "Pending / Menunggu Pembayaran";
  else if (statusCode) statusText = `Gagal / Kadaluarsa (kode: ${statusCode})`;

  return (
    <main>
      <div className="card">
        <h2>Cek Status Manual</h2>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Masukkan ID Order untuk mengecek status pembayaran dari Duitku.
        </p>
      </div>

      <form className="card" onSubmit={handleCheck}>
        <label className="label">ID Order</label>
        <input
          className="input"
          placeholder="misal: PTERO-1700000000000"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Mengecek..." : "Cek Status"}
        </button>
        {error && (
          <p style={{ color: "#f97373", marginTop: "0.75rem" }}>{error}</p>
        )}
      </form>

      {result && (
        <div className="card">
          <h3>Hasil dari Duitku</h3>
          <p>Status: <strong>{statusText || "Tidak diketahui"}</strong></p>
          <pre style={{ fontSize: "0.75rem", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
