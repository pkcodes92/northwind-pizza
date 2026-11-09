import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        component: Home
    }
];
