import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { AuthService } from "../api/_services/authService/auth.service";
import { HttpClient } from "@angular/common/http";
import { AlertifyService } from "../api/_services/alertiFyService/alertify.service";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Company } from "../_models/_companyModel/company";
import { LoginModel } from "../_models/_userModel/LoginModel";
import { environment } from "src/environments/environment";
import { MessagingService } from "../api/_services/messagingService/messaging.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrormessagesService } from "../api/_services/messagingService/errormessages.service";
import { ErrorMessages } from "../_models/_errorModel/errormessages";
import { EnumModel } from "../_models/enumModel";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  model: LoginModel;
  roles: EnumModel[];
  errorMessage: string;
  currentUrl: string;
  errorMessagesModel: ErrorMessages;
  accessDenide: boolean = false;
  @Output() adminOpened = new EventEmitter<Boolean>();
  @ViewChild("loginForm", null) form: NgForm;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService,
    private messagingService: MessagingService,
    public errorMessagesService: ErrormessagesService,
    private loader: NgxSpinnerService
  ) {
    this.currentUrl = this.router.url;
    this.messagingService.emitChange(this.currentUrl);
  }

  ngOnInit() {
    this.handleErrors();
    this.getRoles();
  }

  register() {}

  Login() {
    this.loader.show();
    this.authService.Login(this.form.value).subscribe(
      (next) => {
        this.alertify.success("მომხმარებელი შევიდა სისტემაში");
        this.loader.hide();
      },
      (error) => {
        this.loader.hide();
        this.alertify.error(error);
        // console.log(error);
      },
      () => {
        this.router.navigate(["/loans"]);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  isAdminLoggedIn() {
    return this.authService.isAdminLoggedIn();
  }

  onAdminNav(adminOpened: boolean) {
    if (adminOpened) {
      this.adminOpened.emit(true);
    }
  }

  handleErrors() {
    this.errorMessagesService.errorMessages
      .asObservable()
      .subscribe((values) => {
        this.errorMessagesModel = values;
        if (this.errorMessagesModel) {
          this.errorMessage = this.errorMessagesModel.message;
          if (this.errorMessagesModel.statusCode == 401) {
            this.authService.onTokenExpired();
          }
        }
      });
  }

  getRoles() {
    this.authService.getRoleTypes().subscribe(
      (response) => {
        this.roles = response;
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }
}
