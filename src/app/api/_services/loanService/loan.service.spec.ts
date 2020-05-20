/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { LoanServices } from "./loan.service";

describe("Service: Retrieval", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanServices],
    });
  });

  it("should ...", inject([LoanServices], (service: LoanServices) => {
    expect(service).toBeTruthy();
  }));
});
