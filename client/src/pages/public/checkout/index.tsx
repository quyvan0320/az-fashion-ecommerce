import { Elements } from "@stripe/react-stripe-js";
import CheckoutInner from "./CheckoutInner";
import { stripePromise } from "@/utils/stripe";
import { Helmet } from "react-helmet-async";

const Checkout = () => (
  <Elements stripe={stripePromise}>
     <Helmet>
            <title>Az Fashion - Thanh toán</title>
          </Helmet>
    <CheckoutInner />
  </Elements>
);

export default Checkout;
