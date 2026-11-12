import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { CartService, OrderService } from "../services";
import { CartItem, Customer } from "../dto/models";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { map, Subscription } from "rxjs";
import { CustomerService } from "../services/customer.service";
import { CreateOrderRequest } from "../dto/request";
import { ErrorResponse } from "../dto/response";

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
  readonly orderService = inject(OrderService);

  selectedCustomer = new FormControl();

  customers: Customer[] = [];

  getCustomersSubscription!: Subscription;
  createOrderSubscription!: Subscription;

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
    const orderRequest: CreateOrderRequest = {
      customerId: this.selectedCustomer.value,
      items: this.cartService.cartItems().map((item) => ({
        quantity: item.quantity,
        pizzaId: item.pizzaId,
      })),
    };

    this.createOrderSubscription = this.orderService
      .createOrder(orderRequest)
      .pipe(map((response) => response.order))
      .subscribe({
        next: (createdOrder) => {
          console.log("The order has been created successfully!");
          console.debug(createdOrder);
        },
        error: (error: ErrorResponse) => {
          console.error("Error occurred: ", error.message);
        },
      });
  }
}
