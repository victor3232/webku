import crypto from "crypto";

const DUITKU_MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE;
const DUITKU_API_KEY = process.env.DUITKU_API_KEY;
const DUITKU_BASE_URL = "https://passport.duitku.com/webapi/api/merchant";

if (!DUITKU_MERCHANT_CODE || !DUITKU_API_KEY) {
  console.warn("Duitku env not set: DUITKU_MERCHANT_CODE / DUITKU_API_KEY");
}

export async function createDuitkuInvoice({ amount, orderId, productName, customerName, email }) {
  const rawSig = DUITKU_MERCHANT_CODE + orderId + amount + DUITKU_API_KEY;
  const signature = crypto.createHash("md5").update(rawSig).digest("hex");

  const body = {
    merchantCode: DUITKU_MERCHANT_CODE,
    paymentAmount: amount,
    paymentMethod: "SP", // QRIS
    merchantOrderId: orderId,
    productDetails: productName,
    customerVaName: customerName || "Customer",
    email,
    phoneNumber: "08123456789",
    itemDetails: [
      {
        name: productName,
        price: amount,
        quantity: 1
      }
    ],
    callbackUrl: `${process.env.APP_URL}/api/duitku/callback`,
    returnUrl: `${process.env.APP_URL}/status?orderId=${orderId}`,
    signature,
    expiryPeriod: 10
  };

  const resp = await fetch(`${DUITKU_BASE_URL}/v2/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await resp.json();

  if (data.statusCode !== "00") {
    console.error("Duitku inquiry failed:", data);
    throw new Error(data.statusMessage || "Duitku inquiry failed");
  }

  return data;
}

export async function checkDuitkuStatus(orderId) {
  const sig = crypto.createHash("md5")
    .update(DUITKU_MERCHANT_CODE + orderId + DUITKU_API_KEY)
    .digest("hex");

  const resp = await fetch(`${DUITKU_BASE_URL}/transactionStatus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchantCode: DUITKU_MERCHANT_CODE,
      merchantOrderId: orderId,
      signature: sig
    })
  });

  return resp.json();
}
