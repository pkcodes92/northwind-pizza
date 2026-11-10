import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { PizzaService } from "../services/pizza";
import { Subscription } from "rxjs";

@Component({
  imports: [],
  selector: "app-home",
  styleUrl: "./home.css",
  templateUrl: "./home.html",
})
export class Home implements OnInit, OnDestroy {
  private readonly pizzaService = inject(PizzaService);

  private getPizzasSubscription!: Subscription;

  ngOnInit(): void {
    this.getPizzasSubscription = this.pizzaService.getPizzas().subscribe({
      next: (response) => {
        console.log("Pizzas fetched successfully:", response.pizzas);
      },
      error: (error) => {
        console.error("Error fetching pizzas:", error);
      },
    });
  }

  ngOnDestroy(): void {
    this.getPizzasSubscription?.unsubscribe();
  }
}
