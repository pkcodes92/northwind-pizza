import { Routes } from "@angular/router";
import { Auth } from "./auth/auth";
import { Home } from "./home/home";
import { NotFound } from "./not-found/not-found";
import { Cart } from "./cart/cart";
import { Orders } from "./orders/orders";
import { Admin } from "./admin/admin";

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
    path: "admin",
    component: Admin,
  },
  {
    path: "orders",
    component: Orders,
  },
  {
    path: "**",
    component: NotFound,
  },
];
