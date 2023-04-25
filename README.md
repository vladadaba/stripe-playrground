# Integrate stripe

https://stripe.com/docs/payments/quickstart

# Testing webhooks locally

```
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe-webhook
```
