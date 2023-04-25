import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { buffer } from "micro";
import { env } from "~/env.mjs";
import { stripe } from "../../server/stripe/client";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);

      // Handle the event types recommended by Stripe
      // https://stripe.com/docs/payments/quickstart#use-webhook
      switch (event.type) {
        case "payment_intent.processing":
          break;
        case "payment_intent.succeeded":
          break;
        case "payment_intent.payment_failed":
          break;
        default:
          // Unexpected event type
          console.log(`Unexpected stripe webhook event: ${event.type}`);
      }

      console.log(event.type);
      //   console.log(JSON.stringify(event, null, 2));

      res.json({ received: true });
    } catch (err) {
      res.status(400).send(err);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
