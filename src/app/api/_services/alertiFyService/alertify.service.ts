import { Injectable } from "@angular/core";
declare let alertify: any;

@Injectable({
  providedIn: "root"
})
export class AlertifyService {
  constructor() {}

  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, function(e) {
      if (e) {
        okCallback();
      } else {
      }
    });
  }
  alert(message: string) {
    alertify
      .alert()
      .setting({
        title: "გაფრთხილება",
        label: "დახურვა",
        message: message
        // onok: function() {
        //   alertify.success("გასაგებია");
        // }
      })
      .show();
  }
  success(message: any) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
