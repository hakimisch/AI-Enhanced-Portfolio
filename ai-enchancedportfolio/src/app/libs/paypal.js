// src/app/libs/paypal.js
import paypal from "@paypal/checkout-server-sdk";

const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

function paypalClient() {
  return new paypal.core.PayPalHttpClient(
    new Environment(
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    )
  );
}

if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error("⚠️ Missing PayPal credentials in .env.local");
}

export default paypalClient;