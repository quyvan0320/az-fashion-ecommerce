import { ApiResponse } from "@/types";
import { PaymentIntentData } from "@/types/payment";
import axiosInstance from "./axios";

export const paymentService = {
  createPaymentIntent: async (
    orderId: string,
  ): Promise<ApiResponse<PaymentIntentData>> => {
    const { data } = await axiosInstance.post("/payments/create-intent", {
      orderId,
    });
    return data;
  },
};
