import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

import { PizzaService } from "../services/pizza.service";
import { Pizza } from "../dto/models";

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CartService } from "../services";

@Component({
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  selector: "app-home",
  styleUrl: "./home.css",
  templateUrl: "./home.html",
})
export class Home implements OnInit, OnDestroy {
  private readonly pizzaService = inject(PizzaService);

  private readonly cartService = inject(CartService);

  private getPizzasSubscription!: Subscription;

  isLoading = signal(false);
  errorMessage = signal("");

  pizzas: Pizza[] = [];

  ngOnInit(): void {
    this.isLoading.set(true);

    this.getPizzasSubscription = this.pizzaService.getPizzas().subscribe({
      next: (response) => {
        this.pizzas = response.pizzas;
        this.isLoading.set(false);

        console.log("Fetched pizzas:", this.pizzas);
      },
      error: (error) => {
        console.error("Error fetching pizzas:", error);
        this.errorMessage.set(error.message || "An error occurred while fetching pizzas.");
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  ngOnDestroy(): void {
    this.getPizzasSubscription?.unsubscribe();
  }

  addToCart(pizza: Pizza) {
    this.cartService.addItem({
      name: pizza.name,
      pizzaId: pizza.id,
      unitPrice: pizza.basePrice,
    });
  }
}
