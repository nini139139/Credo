/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { LoanListComponent } from "./loan-list.component";

describe("RetrievalListComponent", () => {
  let component: LoanListComponent;
  let fixture: ComponentFixture<LoanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
