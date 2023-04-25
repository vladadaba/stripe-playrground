import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { stripe } from "~/server/stripe/client";

const schema = z.object({ name: z.string(), costInCents: z.number() });
export const checkoutRouter = createTRPCRouter({
  createPaymentIntent: publicProcedure
    .input(schema)
    .mutation(async ({ input }) => {
      const item = await schema.parseAsync(input);

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: item.costInCents,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    }),
});
