import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ElementRef, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
  FormControl,
} from "@angular/forms";
import { Loans } from "src/app/_models/_loanModel/loans";
import { from, of } from "rxjs";
import { LoanServices } from "src/app/api/_services/loanService/loan.service";
import { error } from "@angular/compiler/src/util";
import { Router } from "@angular/router";
import { AlertifyService } from "src/app/api/_services/alertiFyService/alertify.service";
import { EnumModel } from "src/app/_models/enumModel";
import { AuthService } from "src/app/api/_services/authService/auth.service";
import { StatusType } from "src/app/enums/statusenum";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from "../date.adapter";
import { CommonService } from "src/app/api/_services/commonServices/common.service";
import { General, RoleValue } from "src/app/enums/general.enum";
import {
  ObjectTypeKey,
  LoanStatusesValue,
} from "src/app/enums/objectTypes.enum";

@Component({
  selector: "app-common-form",
  templateUrl: "./common-form.component.html",
  styleUrls: ["./common-form.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
  ],
})
export class CommonFormComponent implements OnInit {
  @Input() locationFrom: string;
  @Input() set loanDetail(loanEditObj: Loans) {
    this.setLoanEdit(loanEditObj);
  }
  @Input() action: string;
  @Output() loanRegistered = new EventEmitter<Boolean>();
  @Output() loanUpdated = new EventEmitter<Boolean>();
  @ViewChild("editForm", { static: false }) editForm: NgForm;
  @Input() isAdminUrl: Boolean;

  //arrays for dropdowns
  loanTypes: EnumModel[];
  currencies: EnumModel[];
  //
  createNew: boolean;
  loanModel: Loans;
  filteredLoanModel: Loans;
  form: FormGroup;
  valForDropdown: number;
  adminUrl: string;
  urls: any = [];
  statusType: number;
  loanId: number;
  isSaveDisabled: boolean = false;
  isSaveHide: boolean = false;
  isApprove: boolean = true;
  isCancel: boolean = true;
  isSentHide: boolean = false;
  isUploadDisabled: boolean = false;
  constructor(
    private fb: FormBuilder,
    private loanServices: LoanServices,
    private alertiFy: AlertifyService,
    public dialog: MatDialog,
    private authService: AuthService,
    private loader: NgxSpinnerService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.creatSaveForm();
    this.getLoanTypes();
    this.getCurrencies();
  }

  creatSaveForm() {
    this.form = this.fb.group({
      id: [""],
      userId: [""],
      loanTypeId: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      amount: ["", Validators.required],
      valuta: ["", Validators.required],
      // urls: [],
    });
  }

  disablePriorityAndServices() {
    this.form.get("loanTypeId").disable();
  }

  enableClientAndServices() {
    this.form.get("loanTypeId").enable();
  }

  disableFieldsInSendToCredo() {
    // disable buttons
    this.isSaveHide = true;
    this.isSentHide = true;
    this.isApprove = false;
    this.isCancel = false;
  }

  setLoanEdit(data: Loans) {
    if (data) {
      this.loanModel = data;

      this.loanId = this.loanModel.id;
      if (!this.form) {
        this.creatSaveForm();
      }
      this.form.controls.loanTypeId.patchValue(this.loanModel.loanTypeId);

      this.form.patchValue(this.loanModel);

      if (this.authService.decodedToken.UserRole == RoleValue.Admin) {
        this.disableFieldsInSendToCredo();
      }
    }
  }

  getLoanTypes() {
    this.loader.show();
    this.loanServices.getLoanTypes().subscribe(
      (response) => {
        this.loanTypes = response;
        this.loader.hide();
      },
      (error) => {
        this.loader.hide();
        this.alertiFy.error(error);
      }
    );
  }
  getCurrencies() {
    this.loanServices.getCurrencies().subscribe(
      (response) => {
        this.currencies = response;
        if (this.createNew) {
          // this.form.controls.valuta.patchValue(this.currencies[0].id);
          this.loader.hide();
        }
      },
      (error) => {
        this.loader.hide();
        this.alertiFy.error(error);
      }
    );
  }
  setLoanStatus(btnName) {
    let isPermitted = true;
    switch (btnName) {
      case "save": {
        this.setStatusType(LoanStatusesValue.Saved);
        break;
      }
      case "sent": {
        this.setStatusType(LoanStatusesValue.Sent);
        break;
      }
      case "approve": {
        this.setStatusType(LoanStatusesValue.Approved);
        break;
      }
      case "rejected": {
        this.setStatusType(LoanStatusesValue.Rejected);
        break;
      }
    }
    return isPermitted;
  }

  saveForm() {
    this.findInvalidControls(this.form);

    if (this.form.valid) {
      this.loader.show();
      var clickedButtonName = document.activeElement.getAttribute("Name");
      let isLoanSubmitPermitted = this.setLoanStatus(clickedButtonName);

      if (isLoanSubmitPermitted) {
        if (this.action === General.CreateNew) {
          this.loanModel = Object.assign({}, this.form.getRawValue());
          this.loanModel.loanStatus = this.statusType;
          let loanObj = {};
          Object.keys(this.loanModel).forEach((key) => {
            if (this.loanModel[key] !== "") {
              if (key == "startDate" || key == "endDate") {
                loanObj[key] = this.loanModel[key]
                  ? this.commonService.dateFormater(
                      this.loanModel[key].toString()
                    )
                  : this.loanModel[key];
              } else {
                loanObj[key] = this.loanModel[key];
              }
            }
          });
          this.loanServices.registerLoan(this.loanModel).subscribe(
            (response) => {
              this.alertiFy.success("სესხი წარმატებით დარეგისტრირდა");
              this.dialog.closeAll();
              this.loanRegistered.emit(true);
            },
            (error) => {
              this.loader.hide();
              this.alertiFy.error(error);
            }
          );
        } else {
          this.loanModel = Object.assign({}, this.form.getRawValue());
          this.loanModel.loanStatus = this.statusType;

          let loanObj = {};

          Object.keys(this.loanModel).forEach((key) => {
            if (this.loanModel[key] !== "") {
              if (key == "startDate" || key == "endDate") {
                loanObj[key] = this.loanModel[key]
                  ? this.commonService.dateFormater(
                      this.loanModel[key].toString()
                    )
                  : this.loanModel[key];
              } else {
                loanObj[key] = this.loanModel[key];
              }
            }
          });

          this.loanServices.updateLoan(this.loanModel).subscribe(
            (response) => {
              this.alertiFy.success("სესხი წარმატებით განახლდა");
              this.dialog.closeAll();
              this.loanRegistered.emit(true);
            },
            (error) => {
              this.loader.hide();
              this.alertiFy.error(error);
            }
          );
        }
      } else {
        this.alertiFy.error("შეავსეთ აუცილებელი ველები");
      }
    } else {
      this.alertiFy.error("შეავსეთ აუცილებელი ველები");
    }
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

  setStatusType(type: number) {
    this.statusType = type;
  }

  checkNumberInputValidation(event) {
    return this.commonService.numberOnly(event);
  }
  checkNumberOrLetter(event) {
    return this.commonService.numberOrLetter(event);
  }
}

export const DD_MM_YYYY_Format = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
