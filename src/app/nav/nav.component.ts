import { Component, OnInit } from "@angular/core";
import { AuthService } from "../api/_services/authService/auth.service";
import { AlertifyService } from "../api/_services/alertiFyService/alertify.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  events = [];
  opened = true;
  model: any = {};
  adminUrl: string;
  activeUrl: string = "activeUrl";
  disableUrl: string = "disableUrl";
  selected: string;
  constructor(
    public authService: AuthService,
    private router: Router,
    private location: Location,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.selected = "სესხები";
  }
  Login() {
    this.authService.Login(this.model).subscribe(
      (next) => {
        this.alertify.success("მომხმარებელი შევიდა სისტემაში");
      },
      (error) => {
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(["/loans"]);
      }
    );
  }

  isAdminUrl() {
    let isAdminUrl = false;
    let currentUrl = this.router.url.toString();
    if (currentUrl.toLowerCase().includes("admin")) {
      isAdminUrl = true;
    }
    return isAdminUrl;
  }

  loggedIn() {
    // console.log("User Flag >>>>  "+this.authService.loggedIn());
    return this.authService.loggedIn();
  }

  isAdminLoggedIn() {
    // console.log("Admin Flag >>>> " + this.authService.isAdminLoggedIn());
    return this.authService.isAdminLoggedIn();
  }

  logOut() {
    this.alertify.error("სისტემიდან გამოსვლა");
    localStorage.removeItem("token");
    this.router.navigate(["/home"]);
  }
}
