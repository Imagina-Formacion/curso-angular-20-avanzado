import { Routes } from "@angular/router";

import { authGuard, loginGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login.component").then((c) => c.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (c) => c.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];