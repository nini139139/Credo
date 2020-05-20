import { Injectable } from "@angular/core";
import { Loans } from "../_models/_loanModel/loans";
@Injectable({
  providedIn: "root",
})
export class LoanLisProviderService {
  loanDetailObj: Loans;
  loanLogs: number;

  constructor() {}

  setLoanDetailObj(obj) {
    this.loanDetailObj = obj;
  }

  getLoanDetailObj() {
    return this.loanDetailObj;
  }

  setLoanLogs(obj: number) {
    return (this.loanLogs = obj);
  }
}
