import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { MessagingService } from "../api/_services/messagingService/messaging.service";
import { Router } from "@angular/router";
import { AuthService } from "../api/_services/authService/auth.service";
import { ErrormessagesService } from "../api/_services/messagingService/errormessages.service";
import { ErrorMessages } from "../_models/_errorModel/errormessages";
@Injectable()
export class Interceptor implements HttpInterceptor {
  adminUrl: string;
  errorModel: ErrorMessages;
  constructor(
    private messagingService: MessagingService,
    private router: Router,
    public authService: AuthService,
    public errorMessagesService: ErrormessagesService
  ) {
    this.adminUrl = this.router.url;
    messagingService.changeEmitted$.subscribe(text => {
      this.adminUrl = text;
    });
  }

  isAdminUrl() {
    let isAdminUrl = false;
    if (this.adminUrl) {
      isAdminUrl = this.adminUrl.includes("/admin");
    }
    return isAdminUrl;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem("token");
    // console.log("UserToken:" + token);
    let adminToken = localStorage.getItem("admin-token");
    // console.log("adminToken:" + adminToken);

    if (this.isAdminUrl()) {
      if (token && !this.isAdminUrl()) {
        const headers = new HttpHeaders().set(
          "Authorization",
          "Bearer " + token
        );
        const AuthRequest = request.clone({ headers: headers });
        request = AuthRequest;
      } else if (adminToken && this.isAdminUrl()) {
        const headers = new HttpHeaders().set(
          "Authorization",
          "Bearer " + adminToken
        );
        const AuthRequest = request.clone({ headers: headers });
        request = AuthRequest;
      } else {
        // this.authService.onAdminTokenExpired();

        request = request;
        // return;
      }
    } else {
      const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
      const AuthRequest = request.clone({ headers: headers });
      request = AuthRequest;
      // request = request;
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error && error.error && error.error.statusCode == 401) {
          this.errorModel = error.error;
          this.errorMessagesService.errorMessages.next(this.errorModel);
        } else if (error.status == 401) {
          this.authService.onTokenExpired();
        }

        return throwError(error);
      })
    );
  }
}
