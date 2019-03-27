import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FiColType, FiEditorType} from './FiTableEnums';
import {FiTableConfig} from './fi-table-config';
import {FiFilterBase} from './fi-filter-base';
import {DatePipe, SlicePipe} from '@angular/common';
import {FiTableCol} from './fi-table-col';
import {FiBoolean} from '../utils/core/fi-boolean';
import {FiEventPageChange} from './fi-event-page-change';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'fi-table',
  styleUrls: ['./fi-table.css'],
  templateUrl: './fi-table.component.html',
})
export class FiTableComponent implements OnInit {

  // Input and Outputs(Events)

  // Table'ın Datası rows alanındadır.
  // @Input() public rows: Array<any> = [];
  // @Input() public allowRemoteFilter = false;

  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked: EventEmitter<any> = new EventEmitter();
  @Output() public pageChanged: EventEmitter<any> = new EventEmitter();

  // Paging operation (sayfalama için)
  @Input() pageSize = 10;
  @Input() totalDataLength = 0;

  public page = 1;

  // Date Format
  @Input() dateFormat = 'dd/MM/yyyy';

  // Table values
  public currentItem: any;
  public currentColumnToSort: FiTableCol;

  public showFilterRow = false;

  public rowsFiltered: any[] = [];
  public rowsSliced: any[] = [];

  // for getter and setters
  private _rows: any[] = [];
  private _columns: FiTableCol[] = [];
  private _config: FiTableConfig = {};

  // Template'den Enum ve Tiplere ulaşmak için tanımlandı.
  fiEditorType = FiEditorType;
  fiColtype = FiColType;

  filterStatus = true;

  // Pencerenin boyutuna göre template tasarımı için
  public innerWidth: any;

  public constructor(private sanitizer: DomSanitizer, private datepipe: DatePipe, private slicePipe: SlicePipe) {

  }


  ngOnInit() {

    console.log('ngOninit Fitable');

    //this.onChangeTable(this.config);
    //this.rowsFiltered = this.rows;
    this.innerWidth = window.innerWidth;
    this.config.fiTableComp = this;
  }

  @Input()
  public set rows(rowsData: any[]) {

    console.log('Set Rows On FiTable');

    if (!rowsData) {
      rowsData = [];
    }

    for (let index = 0; index < rowsData.length; index++) {
      const element = rowsData[index];
      element.fiIndex = index;
    }

    this._rows = rowsData;
    this.rowsFiltered = rowsData;
    this.filterAndSortTable(null);
    this.sliceTable();
  }

  public get rows(): any[] {
    return this._rows;
  }

  @Input()
  public set config(conf: FiTableConfig) {

    // FIXME class diger string olarak gönderilebilir
    // Classname array olarak gelmişse onlar birleştirilir.
    if (!conf.className) {
      conf.className = 'table-bordered';  // table-striped is removed.
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }

    conf.columns.forEach(value => {

      if (conf.filterAuto) {
        if (!value.filtering) {
          value.filtering = new FiFilterBase();
        }
      }

    });

    if (conf.pageSize) {
      this.pageSize = conf.pageSize;
    }

    this._config = conf;

    //col ve row input ile almalı, burada alınca değişimleri takip etmiyor, non-reactive
    //this.columns = conf.columns;
    //this.rows = conf.rows;

  }

  public get config(): FiTableConfig {
    return this._config;
  }

  @Input()
  public set columns(fiColumns: FiTableCol[]) {

    fiColumns.forEach((value: FiTableCol) => {

      if (value.filtering) {
        this.showFilterRow = true;
      }

      if (value.className && value.className instanceof Array) {
        value.className = value.className.join(' ');
      }

      const column = this._columns.find((col: any) => col.field === value.field);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });

  }

  public get columns(): FiTableCol[] {
    return this._columns;
  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public get configColumns(): any {

    const sortColumns: any[] = [];

    this.columns.forEach((column: any) => {
      if (column.sortStatus) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  // sortchange için kullanılıyordu, değiştirildi, onsortchange metoduna yönlenir sort eylemi
  public onChangeTable(column: FiTableCol): void {

    this._columns.forEach((col: FiTableCol) => {
      if (col.field !== column.field && col.sortStatus !== false) {
        col.sortStatus = '';
      }
    });

    this.tableChanged.emit({sorting: this.configColumns});
  }

  public filterAndSortTable(columnEdited: FiTableCol): void {

    console.log('Filter and Sort');
    //this.page = 1;

    let columnToSort = this.currentColumnToSort;

    let columnToSortName = '';

    if (this.currentColumnToSort !== undefined) {
      columnToSortName = this.currentColumnToSort.field;
    }

    // diger sütunlar sort alanı(property) temizlenir.
    this._columns.forEach((col: FiTableCol) => {

      let colNameBinded = false;

      if (!colNameBinded && columnToSortName === '') {
        col.sortStatus = '';
        colNameBinded = true;
      }

      if (!colNameBinded && col.field !== columnToSortName && col.sortStatus !== false) {
        col.sortStatus = '';
      }

    });

    // this.tableChanged.emit({sorting: this.configColumns});

    // onchange Table Metodu
    // if (this.config.filtering) {
    //   Object.assign(this.config.filtering, this.config.filtering);
    // }

    // if (this.config.sorting) {
    // Object.assign(hedef,kaynaklar...)
    //   Object.assign(this.config.sorting, this.config.sorting);
    // }
    //console.log('rows:',this._rows );
    //console.log('config:', this.config);

    const filteredData = this.filterData(this._rows, this.config);
    const sortedData = this.sortData(filteredData, columnToSort);

    // FIXME buradaki eski yapı düzeltilmedi
    // this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;

    this.rowsFiltered = sortedData;

    // if (columnEdited !== null) {
    //   this.config.dataLength = this.rowsFiltered.length;
    // }

    this.sliceTable();

    // FIXME buradaki eski yapı düzeltilmedi
    // this.length = sortedData.length;

    // this.tableChanged.emit({sorting: this.configColumns});
  }


  public onSortTable(columnToSort: FiTableCol): void {

    this.currentColumnToSort = columnToSort;
    this.filterAndSortTable(null);

  }

  public sortData(filteredData: any[], columnToSort: FiTableCol): any {

    if (columnToSort === undefined) {
      return filteredData;
    }

    if (!this.config.sorting) {
      return filteredData;
    }

    const columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    // for (let i = 0; i < columns.length; i++) {

    //   if (columns[i].sort === "" && columns[i].sort !== false){
    //     console.log('fi Index set');
    //     columnName= "fiIndex";
    //     sort = 'asc';
    //   }

    //   if (columns[i].sort !== '' && columns[i].sort !== false) {
    //     columnName = columns[i].name;
    //     sort = columns[i].sort;
    //   }
    // }

    //console.log(columnToSort);

    // if(columnToSort.sort==false){
    //   return data;
    // }

    if (columnToSort.sortStatus === '') {
      // console.log('fi Index set');
      columnName = 'fiIndex';
      sort = 'asc';
    }

    if (columnToSort.sortStatus !== '' && columnToSort.sortStatus !== false) {
      columnName = columnToSort.field;
      sort = columnToSort.sortStatus;
    }

    if (!columnName) {
      return filteredData;
    }

    //console.log(filteredData);

    // simple sorting
    return filteredData.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }


  public filterData(data: any, config: FiTableConfig): any {

    let filteredData: any[] = data;

    //uncomm  -- aynı objeyi işaret ediyorlar
    //console.log('this columns:', this.columns );
    //console.log('config columns:', config.columns );

    this.columns.forEach((column: FiTableCol) => {

      if (!column.filtering) {
        return;
      }

      // false olanları filtreliyor,kaldırıyor, true olanlar kalıyor sadece
      filteredData = filteredData.filter((item: any) => {

        // filterstring yoksa filtreleme yapmıyor
        if (!column.filtering.filterString) {
          return true;
        }

        let cellValue = item[column.field].toLocaleLowerCase();

        if (column.colType === FiColType.date) {
          // TODO note pipe fonksiyon olarak kullanma : github
          cellValue = this.datepipe.transform(cellValue, this.dateFormat);
        }

        return cellValue.match(column.filtering.filterString.toLocaleLowerCase());

      });
    });

    return filteredData;
  }

  public getData(row: any, column: FiTableCol): string {

    const propertyName: string = column.field;

    // if dot seperator is used in a field name
    //let cellvalue = propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);

    let cellvalue = row[propertyName];

    if (cellvalue === undefined) {
      return 'null';
    }

    if (column.colType === FiColType.double) {

      //console.log('type of',typeof(cellvalue));

      if (typeof (cellvalue) === 'number') {
        cellvalue = cellvalue.toFixed(2);
      }

      if (typeof (cellvalue) === 'string') {
        cellvalue = parseFloat(cellvalue).toFixed(2);
      }

    }

    if (column.colType === FiColType.boolean) {

    }

    return cellvalue;
  }

  public cellClick(row: any, column: any): void {
    //console.log('cell click event on Table Component');
    this.cellClicked.emit({row, column});
  }

  public rowClick(event: any, item: any) {
    //console.log('row click event:');
    //console.log(event);
    this.currentItem = item;
  }

  changePage(config: FiTableConfig, $event: number, ngbPagination: NgbPagination) {

    let pageChangeEvent: FiEventPageChange = {config, pageNumber: $event};

    this.pageChanged.emit(pageChangeEvent);
    console.log('page', this.page);
    console.log('pageSize', this.pageSize);
    console.log('config', config);
    this.sliceTable();

    //listSlice(this.rows,this.page,this.pageSize)

    //console.log('$event', $event);
  }

  editorUserRenderer(column: FiTableCol, row: any, cellValue: any, fiComp: any) {

    if (column.editorRenderer) {
      column.editorRenderer(row, cellValue, fiComp);
    }

  }

  onFilterUserAction(column: FiTableCol, filterComp: HTMLInputElement) {
    if (column.filterAction) {
      column.filterAction(column, filterComp);
    }
  }


  styleTableCell(fiTableTd: HTMLTableDataCellElement, column: FiTableCol) {

    if (column.colType === FiColType.double || column.colType === FiColType.integer) {
      fiTableTd.style.textAlign = 'right';
    }

  }

  styleTableRow(fiTableTr: HTMLTableRowElement, row: any) {

  }

  styleFiTableHeader(fiTableHeader: HTMLTableHeaderCellElement, column: FiTableCol) {

    if (column.prefSize) {
      //fiTableHeader.style.width = String(column.prefSize);
    }

  }

  toggleFiltre() {
    this.filterStatus = FiBoolean.toggleBoolean(this.filterStatus);
  }

  private sliceTable() {
    if (!this.config.pagingDisable) {

      if (!this.config.pagingVirtual) {
        let startIndex = (this.page - 1) * this.pageSize;
        let endIndex = (this.page - 1) * this.pageSize + this.pageSize;
        this.rowsSliced = this.slicePipe.transform(this.rowsFiltered, startIndex, endIndex);
      } else {
        this.rowsSliced = this.rowsFiltered;
      }

    } else {
      this.rowsSliced = this.rowsFiltered;
    }

  }

  getLength() {
    //console.log('Page Length Called',this.config.dataLength);

    if (this.config.pagingVirtual) {
      return this.config.dataLength;
    }


    return this.rowsFiltered.length;

    //return this.config.dataLength;
  }

  getTableHeight():string {

    if(this.config.tableHeight) {
      return this.config.tableHeight;
    }

    return '70vh';

  }

  addRowToTop(row:any){
    this.rows.unshift(row);
    this.rowsSliced.unshift(row);
  }

}
