"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [pteroUrl, setPteroUrl] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // ambil setting awal (hanya URL, tanpa API key)
    fetch("/api/admin/settings/get")
      .then((r) => r.json())
      .then((data) => {
        if (data.pteroUrl) setPteroUrl(data.pteroUrl);
      })
      .catch(() => {});
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    const apiKey = e.target.apiKey.value;

    try {
      const res = await fetch("/api/admin/settings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          pteroUrl,
          pteroApiKey: apiKey
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      setMessage("Berhasil menyimpan pengaturan.");
      e.target.apiKey.value = "";
    } catch (err) {
      setMessage(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <div className="card">
        <h2>Admin - Pengaturan Panel</h2>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Halaman ini khusus admin untuk mengganti API key & subdomain Pterodactyl tanpa perlu edit kode.
        </p>
      </div>

      <form className="card" onSubmit={handleSave}>
        <div>
          <label className="label">Admin Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            Password ini diset di environment variable <code>ADMIN_PASSWORD</code>.
          </p>
        </div>

        <div>
          <label className="label">Pterodactyl Panel URL / Subdomain</label>
          <input
            className="input"
            placeholder="https://panel.contoh.com"
            value={pteroUrl}
            onChange={(e) => setPteroUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Pterodactyl API Key (Application)</label>
          <input
            className="input"
            name="apiKey"
            type="password"
            placeholder="Tempel API key baru (opsional jika tidak ingin diubah)"
          />
          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            Nilai API key saat ini tidak ditampilkan demi keamanan. Isi hanya jika ingin mengganti.
          </p>
        </div>

        <button className="button" type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>

        {message && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>{message}</p>
        )}
      </form>
    </main>
  );
}
