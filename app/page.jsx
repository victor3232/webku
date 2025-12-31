import { PRODUCTS } from "../data/products";

export default function HomePage() {
  return (
    <main>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Pilih Paket Admin Panel</h2>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Pilih paket panel Pterodactyl sesuai kebutuhan. Pembayaran via QRIS Duitku.
        </p>
      </div>

      {PRODUCTS.map((p) => (
        <div className="card" key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>Panel Pterodactyl {p.name}</h3>
              <p style={{ margin: "0.3rem 0", fontSize: "0.9rem", color: "#eab308" }}>
                Rp {p.price.toLocaleString("id-ID")}
              </p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#9ca3af" }}>
                RAM: {p.ram} MB · Disk: {p.disk} MB · CPU: {p.cpu}%
              </p>
            </div>
            <a className="button" href={`/checkout?productId=${p.id}`}>
              Lanjutkan ke Pembayaran ➜
            </a>
          </div>
        </div>
      ))}
    </main>
  );
}
