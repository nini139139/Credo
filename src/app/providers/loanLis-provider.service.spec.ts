/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { LoanLisProviderService } from "./loanLis-provider.service";

describe("Service: LoanLisProvider", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanLisProviderService],
    });
  });

  it("should ...", inject(
    [LoanLisProviderService],
    (service: LoanLisProviderService) => {
      expect(service).toBeTruthy();
    }
  ));
});
