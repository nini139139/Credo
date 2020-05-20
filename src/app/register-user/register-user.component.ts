import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../_models/_userModel/user";
import { FormGroup, Validators, FormBuilder, NgForm } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { LoanServices } from "../api/_services/loanService/loan.service";
import { AlertifyService } from "../api/_services/alertiFyService/alertify.service";
import { AuthService } from "../api/_services/authService/auth.service";
import { CommonService } from "../api/_services/commonServices/common.service";
import { EnumModel } from "../_models/enumModel";
import { Loans } from "../_models/_loanModel/loans";
import { Router } from "@angular/router";

@Component({
  selector: "app-register-user",
  templateUrl: "./register-user.component.html",
  styleUrls: ["./register-user.component.css"],
})
export class RegisterUserComponent implements OnInit {
  user: User;
  currencies: EnumModel[];
  roleTypes: EnumModel[];
  createNew: boolean;
  loanModel: Loans;
  // form: FormGroup;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alertiFy: AlertifyService,
    private authService: AuthService,
    private loader: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.creatSaveForm();
    this.getRoleTypes();
  }

  creatSaveForm() {
    this.form = this.fb.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      personalIdNumber: ["", Validators.required],
      dateOfBirthday: ["", Validators.required],
      roleId: ["", Validators.required],
    });
  }

  getRoleTypes() {
    this.authService.getRoleTypes().subscribe(
      (response) => {
        this.roleTypes = response;
      },
      (error) => {
        this.loader.hide();
        this.alertiFy.error(error);
      }
    );
  }

  saveForm() {
    this.findInvalidControls(this.form);
    if (this.form.valid) {
      this.loader.show();
      this.user = Object.assign({}, this.form.getRawValue());
      this.authService.RegisterUser(this.user).subscribe(
        (response) => {
          this.loader.hide();
          this.alertiFy.success("წარმატებით დარეგისტრირდით");
          this.router.navigate(["home"]);
        },
        (error) => {
          this.loader.hide();
          this.alertiFy.error(error);
        }
      );
    }
    this.loader.hide();
    console.log(this.user);
  }

  public findInvalidControls(test: any) {
    const invalid = [];
    const controls = test.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
  }
}
