import { CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { CartService } from "../services";
import { CartItem } from "../dto/models";

@Component({
  imports: [CurrencyPipe, MatButtonModule, MatIconModule],
  selector: "app-cart",
  styleUrls: ["./cart.css"],
  templateUrl: "./cart.html",
})
export class Cart {
  readonly cartService = inject(CartService);

  decreaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.pizzaId, item.quantity - 1);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.pizzaId, item.quantity + 1);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.pizzaId);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
