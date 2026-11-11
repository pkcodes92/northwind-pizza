import { OrderItem } from ".";

export interface Order {
  id: number;
  customer: string;
  orderStatus: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
}
