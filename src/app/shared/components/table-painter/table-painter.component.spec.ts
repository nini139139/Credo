/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TablePainterComponent } from './table-painter.component';

describe('TablePainterComponent', () => {
  let component: TablePainterComponent;
  let fixture: ComponentFixture<TablePainterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablePainterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePainterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
