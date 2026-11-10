import { computed, Injectable, Service, signal } from "@angular/core";
import { CartItem } from "../dto/models";

@Service()
export class CartService {
  private readonly items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();

  readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((total, item) => total + item.unitPrice * item.quantity, 0),
  );

  addItem(pizza: Omit<CartItem, "quantity">) {
    this.items.update((items) => {
      const existing = items.find((item) => item.pizzaId === pizza.pizzaId);

      if (existing) {
        return items.map((item) =>
          item.pizzaId === pizza.pizzaId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...items, { ...pizza, quantity: 1 }];
    });
  }

  updateQuantity(pizzaId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(pizzaId);
      return;
    }

    this.items.update((items) =>
      items.map((item) => (item.pizzaId === pizzaId ? { ...item, quantity } : item)),
    );
  }

  removeItem(pizzaId: number) {
    this.items.update((items) => items.filter((item) => item.pizzaId !== pizzaId));
  }

  clearCart() {
    this.items.set([]);
  }
}
