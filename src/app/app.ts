import { Component, inject, signal, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  imports: [RouterOutlet],
  selector: "app-root",
  styleUrl: "./app.css",
  templateUrl: "./app.html",
})
export class App implements OnInit {
  protected readonly title = signal("northwind-pizza");

  private readonly router = inject(Router);

  ngOnInit() {
    this.router.navigateByUrl("/");
  }
}
