import { getPteroSettings } from "./settings.js";

async function pteroFetch(path, options = {}) {
  const { url, apiKey } = await getPteroSettings();
  if (!url || !apiKey) {
    throw new Error("Pterodactyl URL/API key not configured");
  }

  const resp = await fetch(`${url}/api/application${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Pterodactyl error ${resp.status}: ${text}`);
  }

  return resp.json();
}

export async function createPteroUser({ email, username }) {
  const payload = {
    email,
    username,
    first_name: username,
    last_name: "Panel",
    language: "en"
  };

  const res = await pteroFetch("/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return res;
}

export async function createPteroServer({ product, username, email }) {
  // create user first
  const user = await createPteroUser({ email, username });
  const userId = user?.attributes?.id;

  const payload = {
    name: `${product.name}-${username}`,
    user: userId,
    egg: product.egg,
    docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
    startup: "npm start",
    environment: {},
    limits: {
      memory: product.ram,
      swap: 0,
      disk: product.disk,
      io: 500,
      cpu: product.cpu
    },
    feature_limits: {
      databases: 2,
      allocations: 1,
      backups: 2
    },
    deploy: {
      locations: [product.loc],
      dedicated_ip: false,
      port_range: []
    }
  };

  const server = await pteroFetch("/servers", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return server;
}
