import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive, 
    MatSidenavModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatListModule
  ],
  selector: "app-root",
  styleUrls: ["./app.css"],
  templateUrl: "./app.html",
})
export class App {
  protected readonly title = signal("northwind-pizza");

  private readonly router = inject(Router);

  protected readonly navigationItems: NavigationItem[] = [
    { label: "Home", route: "/home", icon: "home" }
  ]

  protected drawerMode: "over" | "side" = "over";
  protected drawerOpened = false;

  protected updateDrawerForViewport(isWide: boolean) {
    this.drawerMode = isWide ? "side" : "over";
    this.drawerOpened = isWide;
  }
}
