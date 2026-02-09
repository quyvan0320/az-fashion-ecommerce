import { OrderStatus } from "@prisma/client";

export interface CreateOrderInput {
  addressId: string;
  paymentMethod: string;
  notes: string;
}


export interface GetOrderQuery {
  page?: number
  limit?: number
  status?: OrderStatus 
}