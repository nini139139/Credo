import { Component, OnInit } from "@angular/core";
import { LoanServices } from "../../api/_services/loanService/loan.service";
import { Loans } from "../../_models/_loanModel/loans";
import { ActivatedRoute } from "@angular/router";
import { EnumModel } from "src/app/_models/enumModel";
import { LoanSearchResult } from "src/app/_models/_loanModel/LoanSearchResult";
import { AuthService } from "src/app/api/_services/authService/auth.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-loan-list",
  templateUrl: "./loan-list.component.html",
  styleUrls: ["./loan-list.component.css"],
})
export class LoanListComponent implements OnInit {
  loans: Loans[];
  loanFilteredRequest: any;
  totalRecords: number = 0;
  totalItemsPerPage: number = 0;
  pageConfigData: any;

  constructor(
    private loanServices: LoanServices,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loader: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans() {
    this.loader.show();
    setTimeout(() => {
      let pageNumber = 1;
      if (this.pageConfigData) {
        pageNumber = this.pageConfigData.currentPage;
      }

      this.loanServices.getPaginationLoans(pageNumber).subscribe(
        (loanSearchResult: LoanSearchResult) => {
          this.loans = loanSearchResult.loanResult;
          this.totalRecords = loanSearchResult.totalRecords;
          this.totalItemsPerPage = loanSearchResult.pageSize;
          this.loader.hide();
        },
        (error) => {
          this.loader.hide();
          if (error == "Unauthorized") {
            this.authService.onTokenExpired();
          }
        }
      );
    }, 10);
  }

  loadLoansFiltered() {
    this.loanServices.postSearchLoansResult(this.loanFilteredRequest).subscribe(
      (response) => {
        response["loanFilterRequest"] = this.loanFilteredRequest;
        this.onLoanFiltered(response);
        this.loader.hide();
      },
      (error) => {
        this.loader.hide();
        console.log(error);
      }
    );
  }

  onLoanAdded(added: boolean) {
    if (added) {
      this.loadLoans();
    }
  }

  onLoanUpdate(updated: boolean) {
    if (updated) {
      if (this.loans && this.loanFilteredRequest) {
        this.loader.show();
        this.loadLoansFiltered();
      } else {
        this.loadLoans();
      }
    }
  }

  onLoanFiltered($event) {
    this.loans = $event.loanResult;
    this.loanFilteredRequest = $event.loanFilterRequest;
    this.totalRecords = $event.totalRecords;
    this.totalItemsPerPage = $event.totalItemsPerPage;
  }

  onPageChanged($event) {
    this.pageConfigData = $event;
    if (this.pageConfigData) {
      this.loadLoans();
    }
  }
}
