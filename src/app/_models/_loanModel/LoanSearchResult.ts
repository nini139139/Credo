import { Loans } from "./loans";

export class LoanSearchResult {
  loanResult: Loans[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}
