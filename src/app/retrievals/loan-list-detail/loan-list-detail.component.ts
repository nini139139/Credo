import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { Loans } from "src/app/_models/_loanModel/loans";
import { TableRowData } from "src/app/shared/components";
import { Title } from "@angular/platform-browser";
import { LoanServices } from "src/app/api/_services/loanService/loan.service";
import { Router } from "@angular/router";
import { EnumModel } from "src/app/_models/enumModel";
import { switchMap } from "rxjs/operators";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "src/app/api/_services/authService/auth.service";
import { AlertifyService } from "src/app/api/_services/alertiFyService/alertify.service";
import { MatDialog } from "@angular/material";
import { LoanLisProviderService } from "src/app/providers/loanLis-provider.service";
import { ActionEnum } from "src/app/enums/actionenum";
import { moment } from "ngx-bootstrap/chronos/test/chain";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/api/_services/commonServices/common.service";
import {
  ObjectTypeKey,
  LoanStatusesValue,
} from "src/app/enums/objectTypes.enum";
import { General, RoleValue } from "src/app/enums/general.enum";
import { StatusType } from "src/app/enums/statusenum";

@Component({
  selector: "app-loan-list-detail",
  templateUrl: "./loan-list-detail.component.html",
  styleUrls: ["./loan-list-detail.component.css"],
})
export class RetirevalListDetailComponent {
  @ViewChild("sctollSectionOnSave", { static: false }) sctollSectionOnSave;

  message: string;
  @Output() loanAdded = new EventEmitter<Boolean>();

  @Output() loanUpdated = new EventEmitter<Boolean>();

  @Output() loanFiltered = new EventEmitter<any>();

  @Output() loanPageChanged = new EventEmitter<any>();

  @Input() totalRecords: number;
  @Input() totalItemsPerPage: number;
  statusType: number;
  action: string = General.CreateNew;
  // loanTypes, loanStatuses, currencies
  @Input() set loanChild(value: Loans[]) {
    if (value) {
      this.updateTableData(value);
    }
    this.updateTableData(value);
    // }
  }

  loanTypes: EnumModel[];
  loanStatuses: EnumModel[];
  currencies: EnumModel[];
  filterTypeValue: string = General.FromLoan;

  documentTypes: EnumModel[];
  tableData: TableRowData[];
  loan: Loans;
  public show = false;
  public addLoanBtn = true;
  public showBtn = true;
  public showEdit = false;
  public buttonName: any = "გამოთხოვის დამატება";

  pageConfigData: any;

  constructor(
    public datepipe: DatePipe,
    private loanService: LoanServices,
    private router: Router,
    private loader: NgxSpinnerService,
    private authService: AuthService,
    private alertify: AlertifyService,
    public dialog: MatDialog,
    private loanDataProvider: LoanLisProviderService,
    private commonService: CommonService
  ) {}
  ngOnInit() {
    if (this.authService.decodedToken.UserRole == RoleValue.Admin) {
      this.addLoanBtn = false;
    }
  }

  updateTableData(data: Loans[]) {
    this.showBtn = true;
    if (data && data.length > 0) {
      this.tableData = data.map<TableRowData>((x) => {
        return {
          cells: [
            {
              header: "loanTypeId",
              title: "სესხის ტიპი",
              value: x.loanTypeName ? x.loanTypeName.toString().trim() : null,
              filterType: "dropdown",
              isHidden: true,
            },
            {
              header: "amount",
              title: "თანხა",
              value: x.amount ? x.amount.toString().trim() : null,
              filterType: "numberInput",
              isHidden: true,
            },
            {
              header: "startDate",
              title: "სესხის დაწყების თარიღი",
              value: x.startDate
                ? this.getDateFromAspNetFormat(x.startDate.toString().trim())
                : null,
              filterType: "dateTime",
              isHidden: true,
            },
            {
              header: "endDate",
              title: "სესხის დასრულების თარიღი",
              value: x.endDate
                ? this.getDateFromAspNetFormat(x.endDate.toString().trim())
                : null,
              filterType: "dateTime",
              isHidden: true,
            },
            {
              header: "UserName",
              title: "მომხმარებელი",
              value: x.userName ? x.userName.toString().trim() : null,
              filterType: "numberInput",
              isHidden: true,
            },
            {
              header: "CreateDate",
              title: "შექმნის თარიღი",
              value: x.createDate
                ? this.getDateFromAspNetFormat(x.createDate.toString().trim())
                : null,
              filterType: "dateTime",
              isHidden: true,
            },
            {
              header: "LastUpdateDate",
              title: "ბოლო განახლების თარიღი",
              value: x.lastUpdateDate
                ? this.getDateFromAspNetFormat(
                    x.lastUpdateDate.toString().trim()
                  )
                : null,
              filterType: "dateTime",
              isHidden: true,
            },
            {
              header: "LoanStatus",
              title: "სესხის სტატუსი",
              value: x.loanStatusName
                ? x.loanStatusName.toString().trim()
                : null,
              filterType: "dropdown",
              isHidden: true,
            },
            {
              header: "Valuta",
              title: "ვალუტა",
              value: x.valutaName ? x.valutaName.toString().trim() : null,
              filterType: "dropdown",
              isHidden: true,
            },
          ],
          actions: [
            {
              icon: "მონაცემების ცვლილება",
              execute: () => {
                if (
                  x.loanStatus == StatusType.Approved ||
                  x.loanStatus == StatusType.Rejected
                ) {
                  this.alertify.error("არ გაქვთ ამ სესხთან მუშოაბის უფლება");
                  return;
                }

                this.showEdit = true;
                this.show = false;
                this.loader.show();
                this.loadLoan(x.id, ActionEnum.EDIT);
                this.scrollToBottom();
              },
              isDisabled: false,
              title: "edit",
            },
          ],
        };
      });
      this.loader.hide();
    } else {
      this.tableData = [];
      return;
    }
  }

  public getDateFromAspNetFormat(date: string) {
    let newDate = new Date(date.toString());
    let latest_date = this.datepipe.transform(newDate, "dd/MM/yyy");
    console.log(latest_date.toString());
    return latest_date.toString();
  }
  toggleAdd(action: string) {
    if (action === General.CloseEdit) {
      this.showEdit = false;
      this.show = false;
    } else {
      this.show = !this.show;
    }
    if (this.show) this.showBtn = false;
    else this.showBtn = true;
  }
  loadLoan(id: number, action: any) {
    this.loanService.getLoan(id).subscribe(
      (loan: Loans) => {
        this.loader.hide();
        this.loan = loan;

        if (action == ActionEnum.DETAIL) {
          this.navigateToRegisterLoan(this.loan, id);
        }
      },
      (error) => {
        this.loader.hide();
        console.log(error);
      }
    );
  }

  isCurrentUser(username: string) {
    let isCurrentUser = false;
    let currentUserName = this.authService.decodedToken.unique_name;
    if (currentUserName == username) {
      isCurrentUser = true;
    }
    return isCurrentUser;
  }

  onLoanAdded(added: boolean) {
    if (added) {
      this.show = false;
      this.showEdit = false;
      this.loanAdded.emit(true);
      this.scrollToBottom();
    }
  }

  onLoanUpdate(updated: boolean) {
    if (updated) {
      this.show = false;
      this.showEdit = false;
      this.loanUpdated.emit(true);
      this.scrollToBottom();
    }
  }

  onLoanFiltered($event) {
    this.loanFiltered.emit($event);
  }

  onPageChanged($event) {
    this.loanPageChanged.emit($event);
  }

  navigateToRegisterLoan(obj: Loans, objLogs: number) {
    this.loanDataProvider.setLoanDetailObj(obj);
    this.loanDataProvider.setLoanLogs(objLogs);
  }

  scrollToBottom() {
    this.sctollSectionOnSave.nativeElement.scrollIntoView({
      behavior: "smooth",
    });
  }
}
