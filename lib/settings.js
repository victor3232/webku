import prisma from "./prisma";

export async function getPteroSettings() {
  const urlSetting = await prisma.setting.findUnique({
    where: { key: "ptero_url" }
  }).catch(() => null);

  const apiKeySetting = await prisma.setting.findUnique({
    where: { key: "ptero_api_key" }
  }).catch(() => null);

  return {
    url: urlSetting?.value || process.env.PTERO_URL || "",
    apiKey: apiKeySetting?.value || process.env.PTERO_API_KEY || ""
  };
}

export async function setPteroSettings({ url, apiKey }) {
  if (url !== undefined) {
    await prisma.setting.upsert({
      where: { key: "ptero_url" },
      update: { value: url },
      create: { key: "ptero_url", value: url }
    });
  }

  if (apiKey !== undefined && apiKey !== "") {
    await prisma.setting.upsert({
      where: { key: "ptero_api_key" },
      update: { value: apiKey },
      create: { key: "ptero_api_key", value: apiKey }
    });
  }
}
