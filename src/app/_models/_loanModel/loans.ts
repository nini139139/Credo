import { Validators } from "@angular/forms";
import { EnumModel } from "../enumModel";
import { User } from "../_userModel/user";

export interface Loans {
  id?: number;
  loanTypeId?: number;
  amount?: number;
  valuta?: string;
  startDate?: Date;
  endDate?: Date;
  loanStatus?: number;
  loanStatusName?: string;
  currencies?: EnumModel;
  loanType?: EnumModel;
  statuses?: EnumModel;
  loanTypeName?: string;
  userName?: string;
  userId?: number;
  lastUpdateUserId?: number;
  lastUpdateDate?: Date;
  createDate?: Date;
  valutaName?: string;
  pageNumber?: number;
  pageSize?: number;
}
