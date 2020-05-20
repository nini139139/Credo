import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, ObservableLike } from "rxjs";
import { Loans } from "src/app/_models/_loanModel/loans";
import { EnumModel } from "src/app/_models/enumModel";
import { StatusType } from "src/app/enums/statusenum";
import { StatusSpec } from "src/app/enums/StatusSpec";
import { LoanSearchResult } from "src/app/_models/_loanModel/LoanSearchResult";
import { ObjectTypeKey } from "src/app/enums/objectTypes.enum";
import { ObserveOnMessage } from "rxjs/internal/operators/observeOn";

@Injectable({
  providedIn: "root",
})
export class LoanServices {
  baseUrl = environment.apiUrl;

  permissionsList: any;

  constructor(private http: HttpClient) {}

  getLoanTypes(): Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(this.baseUrl + "loan/getLoanTypes");
  }
  getLoanStatuses(): Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(this.baseUrl + "loan/GetLoanStatuses");
  }
  getCurrencies(): Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(this.baseUrl + "loan/GetCurrencies");
  }
  getPaginationLoans(pageNumber): Observable<LoanSearchResult> {
    return this.http.get<LoanSearchResult>(
      this.baseUrl + "Loan/getLoan?&pageSize=10&pageNumber=" + pageNumber
    );
  }
  getLoan(id: number): Observable<Loans> {
    return this.http.get<Loans>(this.baseUrl + "loan/getLoan/" + id);
  }

  updateLoan(loanForUpdate: Loans) {
    return this.http.put(
      this.baseUrl + "loan/" + loanForUpdate.id,
      loanForUpdate
    );
  }

  registerLoan(loan: any): Observable<Loans> {
    return this.http.post<Loans>(this.baseUrl + "loan/registerLoan", loan);
  }

  postSearchLoansResult(filterLoans?: Loans): Observable<LoanSearchResult> {
    return this.http.post<LoanSearchResult>(
      this.baseUrl + "loan/PostSearchLoans/",
      filterLoans
    );
  }
}
