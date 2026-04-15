import { Elements } from "@stripe/react-stripe-js";
import CheckoutInner from "./CheckoutInner";
import { stripePromise } from "@/utils/stripe";

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutInner />
  </Elements>
);

export default Checkout;
