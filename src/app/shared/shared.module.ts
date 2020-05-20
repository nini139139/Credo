import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TablePainterComponent } from "./components/table-painter/table-painter.component";
import { CommonFormComponent } from "./components/common-form/common-form.component";
import { MaterialModule } from "./material.module";
import { FormModule } from "./form.module";
import { NgxPaginationModule } from "ngx-pagination";

const COMPONETS = [TablePainterComponent, CommonFormComponent];

@NgModule({
  imports: [CommonModule, FormModule, MaterialModule, NgxPaginationModule],
  declarations: [...COMPONETS],
  exports: [...COMPONETS, FormModule, MaterialModule],
})
export class SharedModule {}
