import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FiColType, FiEditorType, FiTableDataType} from './FiTableEnums';
import {FiFilterBase} from './fi-filter-base';
import {DatePipe, SlicePipe} from '@angular/common';
import {FiTableCol} from './fi-table-col';
import {FiBoolean} from '../utils/core/fi-boolean';
import {FiEventPageChange} from './fi-event-page-change';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {FiLog} from '../../util/fi-log';
import {FiTableModal} from '../fim-table/fi-table-modal';

// <!--slice pipe -->
// <!--| slice: (page-1) * pageSize : (page-1) * pageSize + pageSize -->

@Component({
  selector: 'fi-table',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./fi-table.css'],
  templateUrl: './fi-table.component.html',
})
export class FiTableComponent implements OnInit {

  // Input and Outputs(Events)


  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked: EventEmitter<any> = new EventEmitter();
  @Output() public pageDataRequest: EventEmitter<any> = new EventEmitter();
  @Output() public pageChanged: EventEmitter<any> = new EventEmitter();

  private _fimodal: FiTableModal; //= {rows: []};

  // Template'den Enum ve Tiplere ulaşmak için tanımlandı.
  fiEditorType = FiEditorType;
  fiColtype = FiColType;
  FiTableDataType = FiTableDataType;
  //--------

  filterStatus = true;

  // Pencerenin boyutuna göre template tasarımı için
  public innerWidth: any;
  // enuma çevrilebilir
  public isWindowXs = false;
  public isWindowLg = false;
  // isVirtualDataState: boolean;

  public constructor(private sanitizer: DomSanitizer, private datepipe: DatePipe, private slicePipe: SlicePipe
    , private changeDetectorRef: ChangeDetectorRef) {

  }


  ngOnInit() {

    console.log('ngOninit Fitable');

    //this.onChangeTable(this.config);
    //this.rowsFiltered = this.rows;
    this.innerWidth = window.innerWidth;

    if(innerWidth<600){
      this.isWindowXs=true;
    }else{
      this.isWindowLg=true;
    }

    if(!this.fimodal){
      this.fimodal= new FiTableModal();
    }

    this.fimodal.fiTableComp = this;
    //this.rows = this.fimodal.rows;
    //this.columns = this.fimodal.columns;
  }




  @Input()
  public set fimodal(fiModal: FiTableModal) {

    console.log('Fi Modal Set Edildi', fiModal);

    // if(fiModal){
    //   return;
    // }

    // FIXME class diger string olarak gönderilebilir
    // Classname array olarak gelmişse onlar birleştirilir.
    if (!fiModal.className) {
      fiModal.className = 'table-bordered';  // table-striped is removed.
    }
    if (fiModal.className instanceof Array) {
      fiModal.className = fiModal.className.join(' ');
    }

    if (!fiModal.dataType) {
      fiModal.dataType = FiTableDataType.plainTable;
    }

    fiModal.getColumns().forEach(tblCol => {

      if (fiModal.filterAuto) {
        tblCol.filterable=true;

        // @Deprecated
        if (!tblCol.filtering) {
          tblCol.filtering = new FiFilterBase();
        }
      }

    });

    // if (fiModal.pageSize) {
    //   fiModal.pageSize = fiModal.pageSize;
    // }

    this._fimodal = fiModal;

    this.fimodal.slicePipe = this.slicePipe;
    this.fimodal.datepipe = this.datepipe;

    //col ve row input ile almalı, burada alınca değişimleri takip etmiyor, non-reactive
    //this.columns = fiModal.columns;
    //this.rows = fiModal.rows;

  }

  public get fimodal(): FiTableModal {
    return this._fimodal;
  }


  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }



  // sortchange için kullanılıyordu, değiştirildi, onsortchange metoduna yönlenir sort eylemi
  public onChangeTable(column: FiTableCol): void {

    this.fimodal.getColumns().forEach((col: FiTableCol) => {
      if (col.field !== column.field && col.sortStatus !== false) {
        col.sortStatus = '';
      }
    });

    this.tableChanged.emit({sorting: this.fimodal.getConfigColumns()});
  }

  public onFilterAndSortTable(columnEdited: FiTableCol): void {

    this.fimodal.onFilterAndSortTable(columnEdited);

  }


  public onSortTable(columnToSort: FiTableCol): void {

    this.fimodal.onSortTable(columnToSort);

    // this.currentColumnToSort = columnToSort;
    // this.onFilterAndSortTable(null);

  }

  public onCellClick(row: any, column: any): void {
    //console.log('cell click event on Table Component');
    this.cellClicked.emit({row, column});
  }

  public onRowClick(event: any, item: any) {
    //FiLog(() => console.log('row click event:', item));
    FiLog(() => console.log('Fi Index', item.fiIndex));
    this.fimodal.currentItem = item;
    this.fimodal.currentItemId = item.fiIndex;
  }

  onChangePage(fiTableConf: FiTableModal, pageNo: number, ngbPagination: NgbPagination, tableDiv: HTMLDivElement) {

    console.log('page:', this.fimodal.page);
    console.log('pageSize:', this.fimodal.pageSize);
    console.log('config:', fiTableConf);

    this.fimodal.rowsSliced = [];

    let pageChangeEvent: FiEventPageChange = {tableModal: fiTableConf, pageNumber: pageNo, tableDiv};

    if (fiTableConf.dataType === FiTableDataType.pagingWithCachedData
      || fiTableConf.dataType === FiTableDataType.pagingWithRemoteData) {
      this.pageDataRequest.emit(pageChangeEvent);
    }

    if (fiTableConf.dataType === FiTableDataType.pagingWithLocalData) {
      this.onSliceTable();
      tableDiv.scrollTop = 0;
    }

    // After Page Change Event
    // if (fiTableConf.dataType === FiTableDataType.pagingWithCachedData) {
    //   this.showPage(pageNo);
    //   tableDiv.scrollTop = 0;
    // }


    //this.tableDiv.scrollTop=0;
    //this.onSliceTable();

    //listSlice(this.rows,this.page,this.pageSize)

    //console.log('pageNo', pageNo);
  }

  editorUserRenderer(column: FiTableCol, row: any, cellValue: any, fiComp: any) {

    if (column.editorRenderer) {
      column.editorRenderer(row, cellValue, fiComp);
    }

  }

  onFilterEnterAction(column: FiTableCol, filterComp: HTMLInputElement) {
    if (column.filterEnterAction) {
      column.filterEnterAction(column, filterComp);
    }
  }


  styleTableCell(fiTableTd: HTMLTableDataCellElement, column: FiTableCol) {

    if (column.colType === FiColType.double || column.colType === FiColType.integer) {
      fiTableTd.style.textAlign = 'right';
    }

  }

  styleTableRow(fiTableTr: HTMLTableRowElement, row: any) {

  }

  styleTableHeader(fiTableHeader: HTMLTableHeaderCellElement, column: FiTableCol) {

    if (column.prefSize) {
      //fiTableHeader.style.width = String(column.prefSize);
    }

  }

  toggleFiltre() {
    this.filterStatus = FiBoolean.toggleBoolean(this.filterStatus);
  }



  private onSliceTable() {
    this.fimodal.onSliceTable();
  }


  getTableHeight(): string {

    if (this.fimodal.tableHeight) {
      return this.fimodal.tableHeight;
    }

    return '70vh';

  }

  addRowToTop(row: any) {
    this.fimodal.getRows().unshift(row);
    this.fimodal.rowsSliced.unshift(row);
  }

  refreshTable() {
    //this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  public showPage(pageNumber: number) {
    console.log('Show Page:', pageNumber);
    this.fimodal.rowsSliced = this.fimodal.dataPages[pageNumber];
  }

  checkPaginationEnable():boolean {

    if(!this.fimodal.dataType) {
      return false;
    }

    if(this.fimodal.dataType===FiTableDataType.pagingWithLocalData
      || this.fimodal.dataType===FiTableDataType.pagingWithCachedData
      || this.fimodal.dataType===FiTableDataType.pagingWithRemoteData) {
      return true;
    }

    return false;

  }

  clearViewTable() {
    this.fimodal.rowsSliced = [];
  }


}


// setDataAndLength(dataRows: any[], lnTotalLength: number) {
//
//   this.fimodal.setRows(dataRows);
//
//   if(this.fimodal.dataType === FiTableDataType.pagingWithCachedData){
//     this.fimodal.totalDataLength = lnTotalLength;
//   }
//
// }


// //@Input()
// public set rows(rowsData: any[]) {
//
//   console.log('Set Rows On FiTable');
//
//   if (!rowsData) {
//     return;
//   }
//
//   if (this.fimodal.dataType === FiTableDataType.plainTable) { // sanal sayfalama yoksa filter and sort çalıştırır
//
//     // 0 false olarak göründüğü,1 den başlatıldı.
//     for (let index = 1; index <= rowsData.length; index++) {
//       let element = rowsData[index - 1];
//       element.fiIndex = index;
//     }
//
//     this._rows = rowsData;
//     this.totalDataLength = rowsData.length;
//     this.onFilterAndSortTable(null);
//     // RowsData uzunluğu toplam uzunluk olarak alınır.
//
//     return;
//
//   }

//   if (this.fimodal.dataType === FiTableDataType.pagingWithLocalData) { // sanal sayfalama yoksa filter and sort çalıştırır
//
//     // 0 false olarak göründüğü,1 den başlatıldı.
//     for (let index = 1; index <= rowsData.length; index++) {
//       let element = rowsData[index - 1];
//       element.fiIndex = index;
//     }
//
//     this._rows = rowsData;
//     this.totalDataLength = rowsData.length;
//     this.onFilterAndSortTable(null);
//
//     return;
//   }
//
//   if (this.fimodal.dataType === FiTableDataType.pagingWithCachedData) { // Paging Virtual İse
//
//     let currentPageLength: number = rowsData.length / this.pageSize;
//     this.dataPages = [[]];
//
//     for (let pageIndex = 1; pageIndex <= currentPageLength; pageIndex++) {
//       this.dataPages[pageIndex] = this.sliceData(pageIndex, rowsData);
//     }
//     this.showPage(this.page);
//     return;
//   }
//
//   console.log('Data Type Belirlenmemiş !!!');
//
//
// }

// public get rows(): any[] {
//   return this._rows;
// }

// public addCachePageData(rowsData: any[], pageNo: number) {
//
//   if (!rowsData) {
//     return;
//   }
//
//   let startIndex = (pageNo - 1) * this.pageSize + 1;
//
//   //let pageNoIndex = pageNo;
//
//   for (let index = 0; index < rowsData.length; index++) {
//     let element = rowsData[index];
//     element.fiIndex = startIndex + index;
//
//     if (this.dataPages[pageNo] === undefined) {
//       this.dataPages[pageNo] = [];
//     }
//
//     let indexInPage = (element.fiIndex-1)%this.pageSize;
//     this.dataPages[pageNo][indexInPage]=rowsData[index];
//
//     if ((index + 1) % this.pageSize === 0) {
//       pageNo++;
//       this.dataPages[pageNo]=[];
//     }
//   }
//
//   console.log('cache eklendi', rowsData);
//
//
//   //this.dataPages[pageNo] = rowsData;
//
// }

// getLength() {
//   //console.log('Page Length Called',this.config.dataLength);
//
//   if (this.fimodal.pagingWithCachedData) {
//     return this.fimodal.dataLength;
//   }
//
//
//   return this.rowsFiltered.length;
//
//   //return this.config.dataLength;
// }


// private sliceData(pageNo: number, data: any[]) {
//
//   let startIndex = (pageNo - 1) * this.pageSize + 1; // 1--> 1 , 2 --> 31  (pagesize 30a göre)
//   //let endIndex = startIndex + this.pageSize -1; // 1 --> 30 , 2--> 60
//   let endIndex = pageNo * this.pageSize;  // 1--> 30 2-->60
//
//   // array 0 'dan başladığı için
//   let sliced = this.slicePipe.transform(data, startIndex-1, endIndex); // 0 dan başlıyor, endIndex dahil olmuyor
//
//   for (let index = 0; index < sliced.length; index++) {
//     let element = sliced[index];
//     element.fiIndex = startIndex + index;
//   }
//
//   return sliced;
// }


// public sortData(filteredData: any[],fiTableColToSort:FiTableCol ): any {
//
//   let columnToSort = this.currentColumnToSort;
//
//   let columnToSortName = '';
//
//   if (this.currentColumnToSort !== undefined) {
//     columnToSortName = this.currentColumnToSort.field;
//   }
//
//   // diger sütunların sorting durumu temizlenir.
//   this._columns.forEach((col: FiTableCol) => {
//
//     let colNameBinded = false;
//
//     if (!colNameBinded && columnToSortName === '') {
//       col.sortStatus = '';
//       colNameBinded = true;
//     }
//
//     if (!colNameBinded && col.field !== columnToSortName && col.sortStatus !== false) {
//       col.sortStatus = '';
//     }
//
//   });
//
//   if (columnToSort === undefined) {
//     return filteredData;
//   }
//
//   // if (!this.fimodal.sorting) {
//   //   return filteredData;
//   // }
//   if (!columnToSort.sortable) {
//      return filteredData;
//   }
//
//   const columns = this.fimodal.sorting.columns || [];
//   let columnName: string = void 0;
//   let sort: string = void 0;
//
//   // for (let i = 0; i < columns.length; i++) {
//
//   //   if (columns[i].sort === "" && columns[i].sort !== false){
//   //     console.log('fi Index set');
//   //     columnName= "fiIndex";
//   //     sort = 'asc';
//   //   }
//
//   //   if (columns[i].sort !== '' && columns[i].sort !== false) {
//   //     columnName = columns[i].name;
//   //     sort = columns[i].sort;
//   //   }
//   // }
//
//   //console.log(columnToSort);
//
//   // if(columnToSort.sort==false){
//   //   return data;
//   // }
//
//   if (columnToSort.sortStatus === '') {
//     // console.log('fi Index set');
//     columnName = 'fiIndex';
//     sort = 'asc';
//   }
//
//   if (columnToSort.sortStatus !== '' && columnToSort.sortStatus !== false) {
//     columnName = columnToSort.field;
//     sort = columnToSort.sortStatus;
//   }
//
//   if (!columnName) {
//     return filteredData;
//   }
//
//   //console.log(filteredData);
//
//   // simple sorting
//   return filteredData.sort((previous: any, current: any) => {
//     if (previous[columnName] > current[columnName]) {
//       return sort === 'desc' ? -1 : 1;
//     } else if (previous[columnName] < current[columnName]) {
//       return sort === 'asc' ? -1 : 1;
//     }
//     return 0;
//   });
// }


// public filterData(data: any, config: FiTableConfig): any {
//
//   let filteredData: any[] = data;
//
//   //uncomm  -- aynı objeyi işaret ediyorlar
//   //console.log('this columns:', this.columns );
//   //console.log('config columns:', config.columns );
//
//   this.columns.forEach((column: FiTableCol) => {
//
//     if (!column.filterable) {
//       return;
//     }
//
//     // false olanları filtreliyor,kaldırıyor, true olanlar kalıyor sadece
//     filteredData = filteredData.filter((item: any) => {
//
//       // filterstring yoksa filtreleme yapmıyor
//       //if (!column.filtering.filterString) {
//       if (!column.filterValue) {
//         return true;
//       }
//
//       let cellValue = item[column.field].toLocaleLowerCase();
//
//       if (column.colType === FiColType.date) {
//         // TODO note pipe fonksiyon olarak kullanma : github
//         cellValue = this.datepipe.transform(cellValue, this.dateFormat);
//       }
//
//       //return cellValue.match(column.filtering.filterString.toLocaleLowerCase());
//       return cellValue.match(column.filterValue.toLocaleLowerCase());
//
//     });
//   });
//
//   this.totalDataLength = filteredData.length;
//
//   return filteredData;
// }

// public getData(row: any, column: FiTableCol): string {
//
//   const propertyName: string = column.field;
//
//   // if dot seperator is used in a field name
//   //let cellvalue = propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
//
//   let cellvalue = row[propertyName];
//
//   if (cellvalue === undefined) {
//     return 'null';
//   }
//
//   if (column.colType === FiColType.double) {
//
//     //console.log('type of',typeof(cellvalue));
//
//     if (typeof (cellvalue) === 'number') {
//       cellvalue = cellvalue.toFixed(2);
//     }
//
//     if (typeof (cellvalue) === 'string') {
//       cellvalue = parseFloat(cellvalue).toFixed(2);
//     }
//
//   }
//
//   if (column.colType === FiColType.boolean) {
//
//   }
//
//   return cellvalue;
// }

// public get configColumns(): any {
//
//   const sortColumns: any[] = [];
//
//   this.columns.forEach((column: any) => {
//     if (column.sortStatus) {
//       sortColumns.push(column);
//     }
//   });
//
//   return {columns: sortColumns};
// }


// //@Input()
// public set columns(fiColumns: FiTableCol[]) {
//
//   fiColumns.forEach((value: FiTableCol) => {
//
//     if (value.filtering) {
//       this.showFilterRow = true;
//     }
//
//     if (value.className && value.className instanceof Array) {
//       value.className = value.className.join(' ');
//     }
//
//     const column = this._columns.find((col: any) => col.field === value.field);
//     if (column) {
//       Object.assign(column, value);
//     }
//     if (!column) {
//       this._columns.push(value);
//     }
//   });
//
// }
//
// public get columns(): FiTableCol[] {
//   return this._columns;
// }


// Paging operation (sayfalama için)
//@Input() pageSize = 10;
//@Input() totalDataLength = 0;

//public page = 1;

// Date Format
//@Input() dateFormat = 'dd/MM/yyyy';

// Table values
// currentItem: any;
// currentColumnToSort: FiTableCol;
// currentItemId: number;
// showFilterRow = false;

//rowsFiltered: any[] = [];
//@Input() rowsSliced: any[] = [];

// for getter and setters
//private _rows: any[] = [];
//private _columns: FiTableCol[] = [];

// Table'ın Datası rows alanındadır.
// @Input() public rows: Array<any> = [];
// @Input() public allowRemoteFilter = false;


// sayfalama datası şeklinde
//dataPages: any[][];

