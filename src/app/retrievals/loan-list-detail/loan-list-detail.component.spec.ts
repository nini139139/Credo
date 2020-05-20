/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { RetirevalListDetailComponent } from "./loan-list-detail.component";

describe("RetirevalListDetailComponent", () => {
  let component: RetirevalListDetailComponent;
  let fixture: ComponentFixture<RetirevalListDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetirevalListDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirevalListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
