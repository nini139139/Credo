import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  MatCheckboxModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatTableModule,
  MatCardModule,
  MatSortModule,
  MatPaginatorModule,
  MatInputModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatTabsModule,
  MatTooltipModule
} from "@angular/material";

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatTableModule,
  MatCardModule,
  MatSortModule,
  MatPaginatorModule,
  MatInputModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTabsModule,
  MatTooltipModule,
];

@NgModule({
  imports: [CommonModule, ...MATERIAL_MODULES],
  declarations: [],
  exports: [...MATERIAL_MODULES]
})
export class MaterialModule {}
