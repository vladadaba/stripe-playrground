import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PK);

const App = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { mutateAsync } = api.checkout.createPaymentIntent.useMutation();

  useEffect(() => {
    const createIntent = async () => {
      const { clientSecret: secret } = await mutateAsync({
        name: "test product",
        costInCents: 10000,
      });

      return secret;
    };

    createIntent()
      .then((result) => {
        if (result) {
          setClientSecret(result);
        }
      })
      .catch(console.error);
  }, [mutateAsync]);

  const options = {
    clientSecret,
    // appearance: {
    //   theme: "stripe",

    // },
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default App;
