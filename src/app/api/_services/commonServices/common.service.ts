import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DatePipe } from "@angular/common";
import { EnumModel } from "src/app/_models/enumModel";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  baseUrl = environment.apiUrl;
  constructor(public datepipe: DatePipe, private http: HttpClient) {}
  dateFormater(dateValue: string) {
    let dateArray = dateValue.split("/");
    let correctDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
    return correctDate;
  }

  dateFormatterForRequest(dateValue: string) {
    let dateArray = dateValue.split("/");
    let day = parseInt(dateArray[0]) + 1;
    let correctDate = dateArray[1] + "/" + day + "/" + dateArray[2];
    return correctDate;
  }
  getDateFromAspNetFormat(date: string) {
    let newDate = new Date(date.toString());
    let latest_date = this.datepipe.transform(newDate, "dd/MM/yyyy HH:mm:ss");
    return latest_date.toString();
  }

  dateToStringFormater(date: string) {
    let newDate = new Date(date.toString());
    let latest_date = this.datepipe.transform(newDate, "MM/dd/yyyy HH:mm:ss");
    return latest_date.toString();
  }

  checkDateValid(dateValue: string) {
    let dateArray = dateValue.split("/");
    if (
      dateArray[0].length != 2 ||
      dateArray[1].length != 2 ||
      dateArray[2].length != 4
    ) {
      return "თარიღის ფორმატი არასწორია";
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOrLetter(event): boolean {
    const key = event.key.toLowerCase();

    if (
      (key >= "0" && key <= "9") ||
      (key >= "a" && key <= "z") ||
      (key >= "A" && key <= "Z")
    ) {
      return true;
    }
    return false;
  }

  dataIsOnlydigits(event) {
    if (event != null) {
      return event.match(/^[0-9]+$/) != null;
    }
    return false;
  }

  getCurrencies(): Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(this.baseUrl + "values/GetCurrencies");
  }
}
