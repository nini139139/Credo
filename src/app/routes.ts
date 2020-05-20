import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoanListComponent } from "./retrievals/loan-list/loan-list.component";
import { AuthGuard } from "./_guards/auth.guard";
import { Component } from "@angular/core";
import { RegisterUserComponent } from "./register-user/register-user.component";

export const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "registration", component: RegisterUserComponent },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [{ path: "loans", component: LoanListComponent }],
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
