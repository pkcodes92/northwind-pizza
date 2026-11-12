export interface OrderItem {
  pizzaId: number;
  name: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
