// src/app/libs/paypal.js
import paypal from "@paypal/checkout-server-sdk";

// Force Sandbox always (even in production)
const Environment = paypal.core.SandboxEnvironment;

function paypalClient() {
  return new paypal.core.PayPalHttpClient(
    new Environment(
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    )
  );
}

export default paypalClient;
