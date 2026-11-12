import { CreateOrderItemRequest } from ".";

export interface CreateOrderRequest {
  customerId: number;
  items: CreateOrderItemRequest[];
}
