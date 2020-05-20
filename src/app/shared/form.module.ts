import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,
        ReactiveFormsModule} from '@angular/forms';

const FORM_MODULE = [
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [CommonModule, ...FORM_MODULE],
  declarations: [],
  exports: [...FORM_MODULE]

})
export class FormModule { }
