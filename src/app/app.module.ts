import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {
  HashLocationStrategy,
  LocationStrategy,
  DatePipe,
} from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BsDropdownModule } from "ngx-bootstrap";
import { RouterModule } from "@angular/router";
import { JwtModule } from "@auth0/angular-jwt";

import { AppRoutingModule } from "./app-routing.module";
import { NavComponent } from "./nav/nav.component";
import { from } from "rxjs";
import { HomeComponent } from "./home/home.component";
import { AuthService } from "./api/_services/authService/auth.service";
import { ErrorInterceptorProvider } from "./api/_services/errorHandler/error.interceptor";
import { AlertifyService } from "./api/_services/alertiFyService/alertify.service";
import { LoanListComponent } from "./retrievals/loan-list/loan-list.component";
import { appRoutes } from "./routes";
import { AuthGuard } from "./_guards/auth.guard";
import { LoanServices } from "./api/_services/loanService/loan.service";
import { RetirevalListDetailComponent } from "./retrievals/loan-list-detail/loan-list-detail.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { Interceptor } from "./intercepters/interceptor";
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonService } from "./api/_services/commonServices/common.service";
import { RegisterUserComponent } from "./register-user/register-user.component";
import { AppComponent } from "./app.component";
export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoanListComponent,
    RetirevalListDetailComponent,
    RegisterUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:5000"],
        blacklistedRoutes: ["localhost:5000/api/Auth"],
      },
    }),
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    AlertifyService,
    AuthGuard,
    LoanServices,
    CommonService,
    DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
