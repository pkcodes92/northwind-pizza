import { Routes } from "@angular/router";
import { Auth } from "./auth/auth";
import { Home } from "./home/home";
import { NotFound } from "./not-found/not-found";
import { Cart } from "./cart/cart";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: Home,
  },
  {
    path: "cart",
    component: Cart,
  },
  {
    path: "**",
    component: NotFound,
  },
];
