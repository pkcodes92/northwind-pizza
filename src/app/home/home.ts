import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

import { CartService, LoadingService, PizzaService } from "../services";
import { Pizza } from "../dto/models";

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: "app-home",
  styleUrl: "./home.css",
  templateUrl: "./home.html",
})
export class Home implements OnInit, OnDestroy {
  private readonly pizzaService = inject(PizzaService);
  private readonly loadingService = inject(LoadingService);
  private readonly cartService = inject(CartService);

  private getPizzasSubscription!: Subscription;

  errorMessage = signal("");

  pizzas: Pizza[] = [];

  ngOnInit(): void {
    this.loadingService.show("Loading deliciousness...");

    this.getPizzasSubscription = this.pizzaService.getPizzas().subscribe({
      next: (response) => {
        this.pizzas = response.pizzas;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error("Error fetching pizzas:", error);
        this.errorMessage.set(error.message || "An error occurred while fetching pizzas.");
      },
      complete: () => this.loadingService.hide(),
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
