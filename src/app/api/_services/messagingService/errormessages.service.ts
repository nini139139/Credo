import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ErrorMessages } from 'src/app/_models/_errorModel/errormessages';

@Injectable({
  providedIn: 'root'
})
export class ErrormessagesService {
  public errorMessages: BehaviorSubject<ErrorMessages>;

  constructor() {
      //initialize it to false
      this.errorMessages = new BehaviorSubject<ErrorMessages>(null);
  }
}
