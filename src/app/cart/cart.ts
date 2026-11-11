import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { CartService } from "../services";
import { CartItem, Customer } from "../dto/models";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { map, Subscription } from "rxjs";
import { CustomerService } from "../services/customer.service";

@Component({
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  selector: "app-cart",
  styleUrls: ["./cart.css"],
  templateUrl: "./cart.html",
})
export class Cart implements OnInit {
  readonly cartService = inject(CartService);
  readonly customerService = inject(CustomerService);

  selectedCustomer = new FormControl();

  customers: Customer[] = [];

  getCustomersSubscription!: Subscription;

  ngOnInit() {
    this.loadCustomers();
  }

  private loadCustomers() {
    this.getCustomersSubscription = this.customerService
      .getCustomers()
      .pipe(map((response) => response.customers))
      .subscribe({
        next: (customers) => {
          this.customers = customers;
        },
        error: (error) => {
          console.log("Error: ", error.error);
        },
      });
  }

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

  checkout() {
    console.log("The relevant items in the cart: ", JSON.stringify(this.cartService.cartItems()));
    console.log("The customer ID: ", this.selectedCustomer.value);
  }
}
