import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDialog,
  MatCheckboxChange,
} from "@angular/material";
import { Router } from "@angular/router";
import { EnumModel } from "src/app/_models/enumModel";
import { Loans } from "src/app/_models/_loanModel/loans";
import { Observable } from "rxjs";
import { LoanServices } from "src/app/api/_services/loanService/loan.service";
import { AlertifyService } from "src/app/api/_services/alertiFyService/alertify.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AppDateAdapter, APP_DATE_FORMATS } from "../date.adapter";
import { CommonService } from "src/app/api/_services/commonServices/common.service";
import { IfStmt } from "@angular/compiler";
import { General } from "src/app/enums/general.enum";
import { TablePainter } from "src/app/_models/tablePainter";
import { HttpParams } from "@angular/common/http";
import { filter } from "rxjs/operators";
// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: "table-painter",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./table-painter.component.html",
  styleUrls: ["./table-painter.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
  ],
})
export class TablePainterComponent implements OnInit {
  @Output() loanFiltered = new EventEmitter<any>();
  @Output() loanPageChanged = new EventEmitter<any>();
  @Output() packagePageChanged = new EventEmitter<any>();
  @Output() logsPageChanged = new EventEmitter<any>();
  @Input() totalRecordsCount: number;
  @Input() set data(value: TableRowData[]) {
    this.updateTableData(value);
  }
  @Input() set fullDataForTable(data: TablePainter) {
    if (data) {
      this.totalRecordsCount = data.totalRecords;
      // this.totalIteamsPerPageCount = data.totalIteamsPerPageCount;
      this.totalIteamsPerPageCount = 1;
      this.objId = data.id;
      this.updateTableData(data.data);
    }
  }
  @Input() set searchPackageData(value: TableRowData[]) {
    this.updateTableData(value);
  }
  @Input() objectTypeId: number;
  @Input() filterPageType: string;
  @Input() totalIteamsPerPageCount: number;
  @Input() showcells: Observable<any>;
  @ViewChild("selectId", { static: false }) selectId;
  @ViewChild("sctollToLeft", { static: false }) sctollToLeft;
  objId: number;
  showcellsvalue: boolean;
  fullDiplayedColumns: string[] = [];
  displayedColumns: string[] = [];
  tempTableData: TableRowData[];
  mainDisplayedColumns: string[] = [];
  displayedTitles: Map<string, string> = new Map();
  displayedHeader: Map<string, string> = new Map();
  displaydFilters: Map<string, string> = new Map();
  displayDropdownSource: Map<string, EnumModel[]> = new Map();
  displayHidden: Map<string, boolean> = new Map();
  dataSource = new MatTableDataSource<any>();
  isHidden: boolean;
  hasActions: boolean;
  seeMoreDysplayColumns: boolean = false;
  buttonName: string = "მეტის ნახვა";
  loanFilterModel: Loans = {};
  loanFilterRequest: Loans;
  paginationConfig: any;
  pageNumber: number = 1;
  selectedFileStatusTypeId: any;
  private paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    mp: MatPaginator
  ) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }
  private sort: MatSort;
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private router: Router,
    private loader: NgxSpinnerService,
    private alertiFy: AlertifyService,
    private commonService: CommonService
  ) {
    this.paginationConfig = {
      itemsPerPage: 10,
      currentPage: this.pageNumber,
      totalItems: 50,
    };
  }

  ngOnInit() {}

  // ----------------------------------
  updateTableData(tableData: TableRowData[], seeMore?: Boolean) {
    if (tableData && tableData.length > 0) {
      if (
        (seeMore == undefined || seeMore == false) &&
        this.seeMoreDysplayColumns != true
      ) {
        this.buttonName = "მეტის ნახვა";
      } else {
        this.buttonName = "ნაკლების ნახვა";
      }
      this.paginationConfig = {
        itemsPerPage:
          this.totalIteamsPerPageCount != 0 ? this.totalIteamsPerPageCount : 20,
        currentPage: this.pageNumber != 0 ? this.pageNumber : 1,
        totalItems: this.totalRecordsCount,
      };
      this.showcellsvalue = true;

      this.displayedTitles.clear();
      this.tempTableData = tableData;
      this.displayedColumns = tableData[0].cells.map<string>((x) => {
        this.displayedTitles.set(x.header, x.title);
        this.displaydFilters.set(x.header, x.filterType);
        this.displayedHeader.set(x.header, x.header);
        this.displayDropdownSource.set(x.header, x.listForDropdown);
        this.displayHidden.set(x.header, x.isHidden);
        return x.header;
      });
      this.fullDiplayedColumns = this.displayedColumns;
      this.mainDisplayedColumns = this.displayedColumns.reduce((acc, cur) => {
        if (this.getHidden(cur)) {
          return [...acc, cur];
        } else {
          return acc;
        }
      }, []);

      if (seeMore || this.seeMoreDysplayColumns) {
        this.displayedColumns = this.fullDiplayedColumns;
      } else {
        this.displayedColumns = this.mainDisplayedColumns;
      }

      this.hasActions = !!tableData[0].actions && !!tableData[0].actions.length;
      if (this.hasActions) {
        this.displayedColumns = [...this.displayedColumns, "actions", "test"];
      }

      const tableDataView: any[] = tableData.map<any>((x) => {
        const keyValues: any[] = x.cells.map<any>((y) => {
          const keyValue = {};
          keyValue[y.header] = y.value;
          return keyValue;
        });
        let finalObject = keyValues.reduce((acc, cur) => {
          return { ...acc, ...cur };
        }, {});
        if (this.hasActions) {
          finalObject["actions"] = x.actions;
        }

        return finalObject;
      });
      this.dataSource = new MatTableDataSource(tableDataView);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      this.showcellsvalue = false;
      const tableDataView: any[] = [];
      this.dataSource = new MatTableDataSource(tableDataView);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginationConfig = {
        itemsPerPage: this.totalIteamsPerPageCount,
        currentPage: this.pageNumber,
        totalItems: this.totalRecordsCount,
      };
      return;
    }
  }

  SettotalRecordsCount(totalrecord: number) {
    console.log(totalrecord);
  }

  getTitle(header: string) {
    return this.displayedTitles.get(header);
  }

  getHeader(header: string) {
    return this.displayedHeader.get(header);
  }

  getFilterName(header: string) {
    return this.displaydFilters.get(header);
  }

  getDropdown(header: string) {
    return this.displayDropdownSource.get(header);
  }
  getHidden(header: string) {
    return this.displayHidden.get(header);
  }

  seeMore() {
    this.seeMoreDysplayColumns = !this.seeMoreDysplayColumns;
    if (this.seeMoreDysplayColumns) {
      this.buttonName = "ნაკლების ნახვა";
    } else {
      this.buttonName = "მეტის ნახვა";
      this.scrollToLeft();
    }
    this.updateTableData(this.tempTableData, this.seeMoreDysplayColumns);
  }

  scrollToLeft() {
    this.sctollToLeft.nativeElement.scrollIntoView({
      behavior: "smooth",
    });
  }

  setFilterRequestData($event) {
    console.log($event);
  }

  updateloanFilterReq(filterType, filterValue, action?) {
    switch (filterType) {
      case "amount": {
        this.loanFilterModel.amount = filterValue;
        break;
      }
      case "currency": {
        this.loanFilterModel.valuta = filterValue;
        break;
      }
      case "loanstatus": {
        this.loanFilterModel.loanStatus = filterValue;
        break;
      }
      case "startDate": {
        this.loanFilterModel.startDate = filterValue
          ? new Date(this.commonService.dateFormatterForRequest(filterValue))
          : null;
        break;
      }
      case "endDate": {
        this.loanFilterModel.endDate = filterValue
          ? new Date(this.commonService.dateFormatterForRequest(filterValue))
          : null;
        break;
      }

      default: {
        break;
      }
    }
  }

  pageChanged(event) {
    this.loader.show();
    if (this.filterPageType == General.FromLoan) {
      this.pageNumber = event;

      if (this.loanFilterRequest) {
        this.loanFilterModel.pageNumber = this.pageNumber;
        this.loanFilterModel.pageSize = 10;
        this.getFilteredData("", "");
      } else {
        this.paginationConfig.currentPage = event;
        this.paginationConfig.itemsPerPage = 10;
        this.loanPageChanged.emit(this.paginationConfig);
      }
    }
  }

  getFilteredData(filterType, filterValue, event?) {
    if (event) {
      if (filterType && event.toLowerCase() == "backspace" && filterValue) {
        this.updateloanFilterReq(filterType, filterValue);
        return;
      } else if (event.toLowerCase() == "datetime" && filterValue) {
        let isDate = this.commonService.checkDateValid(filterValue);
        if (isDate) {
          this.alertiFy.error(isDate);
          return;
        }
      }
    }
  }

  onSelectFileEntity(filterType, selectedFileStatusType) {
    if (
      (selectedFileStatusType != null && selectedFileStatusType != "") ||
      selectedFileStatusType == null
    ) {
      this.selectedFileStatusTypeId =
        selectedFileStatusType == null ? null : selectedFileStatusType.id;
    }
  }
}

export interface TableRowData {
  cells: TableCellItem[];
  actions?: TableAction[];
}

export interface TableCellItem {
  header: string;
  title: string;
  value: string;
  filterType?: string;
  listForDropdown?: EnumModel[];
  isHidden?: boolean;
}

export interface TableAction {
  icon: string;
  title: string;
  execute: () => void;
  isDisabled: boolean;
}
export class Custom {
  name: string;
  id: number;
}
