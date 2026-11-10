import { Routes } from "@angular/router";
import { Auth } from "./auth/auth";
import { Home } from "./home/home";
import { NotFound } from "./not-found/not-found";

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
    path: "**",
    component: NotFound,
  },
];
