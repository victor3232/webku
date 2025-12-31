import "./globals.css";

export const metadata = {
  title: "Panel Pterodactyl Store",
  description: "Simple panel selling site with Duitku payment"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="container">
          <header style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.6rem", margin: 0 }}>✨ Panel Pterodactyl Store</h1>
            <p style={{ margin: "0.3rem 0 0.8rem", color: "#9ca3af", fontSize: "0.9rem" }}>
              Auto order panel &amp; pembayaran via Duitku QRIS
            </p>
            <nav style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem" }}>
              <a href="/">Paket Panel</a>
              <a href="/status">Cek Status Manual</a>
              <a href="/admin">Admin</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
