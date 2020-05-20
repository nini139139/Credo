import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { from, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Company } from "src/app/_models/_companyModel/company";
import { Router } from "@angular/router";
import { AlertifyService } from "../alertiFyService/alertify.service";
import { User } from "src/app/_models/_userModel/user";
import { EnumModel } from "src/app/_models/enumModel";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl = environment.apiUrl + "Auth/";
  baseAdminUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  decodedAdminToken: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  Login(model: any) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem("token", user.tokenHandler);
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenHandler);
        }
      })
    );
  }

  RegisterUser(model: User) {
    return this.http.post(this.baseUrl + "registerUser", model);
  }
  adminLogin(model: any) {
    return this.http.post(this.baseAdminUrl + "Admin/login", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem("admin-token", user.tokenHandler);
          this.decodedAdminToken = this.jwtHelper.decodeToken(
            user.tokenHandler
          );
        }
      })
    );
  }

  getRoleTypes(): Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(this.baseUrl + "getRoleTypes");
  }

  loggedIn() {
    const token = localStorage.getItem("token");
    let isTokenExpired = this.jwtHelper.isTokenExpired(token);
    // console.log(isTokenExpired + "token" + token);
    if (isTokenExpired && token) {
      this.onTokenExpired();
    }
    return !this.jwtHelper.isTokenExpired(token);
  }
  logout() {
    return this.http.get(this.baseUrl + "logout");
  }

  adminLogout() {
    return this.http.get(this.baseAdminUrl + "Admin/logout");
  }

  isAdminLoggedIn() {
    const token = localStorage.getItem("admin-token");
    return !this.jwtHelper.isTokenExpired(token);
  }

  onTokenExpired() {
    localStorage.removeItem("token");
    this.router.navigate(["home"]);
  }
  onAdminTokenExpired() {
    localStorage.removeItem("admin-token");
    this.router.navigate(["/admin"]);
  }
}
