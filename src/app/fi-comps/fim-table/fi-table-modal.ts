import {FiTableCol} from '../fi-table/fi-table-col';
import {FiFilter} from '../fi-table/fi-filter';
import {FiTableComponent} from '../fi-table/fi-table.component';
import {FiColType, FiEditorType, FiTableDataType} from '../fi-table/FiTableEnums';
import {DatePipe, SlicePipe} from '@angular/common';
import {FiBoolean} from '../utils/core/fi-boolean';
import {FiTableModalSimple} from './fi-table-modal-simple';

export class FiTableModal {

  public slicePipe?: SlicePipe; // will set from components.
  public datepipe?: DatePipe;
  /**
   * Paging properties
   */

    // public constructor(private sanitizer: DomSanitizer, private datepipe: DatePipe, private slicePipe: SlicePipe
    //   , private changeDetectorRef: ChangeDetectorRef) {
    // }


  pageSize?: number;
  dataLength?: number;
  dataType?:FiTableDataType;

  tableHeight?:string;
  /**
   * Type: Any = Boolean or String
   *
   * if defined , sorting will be done
   * Sort ype is identified as asc,desc,...
   *
   * Sorting yapılıp yapılmayacağına veya
   * Sorting tipini (asc veya desc) belirtir
   */
  sorting?: any;

  /**
   *
   */
  //filtering?: FiFilter;

  /**
   * Table alacağı stil sınıfları
   * Tek String veya String array oluyor
   */
  className?: any;

  /**
   * FIXME zorunlu olması lazım
   * Tablonun sütunları
   */
  //columns?: FiTableCol[];

  filterAll?: FiFilter;

  // Paging operation (sayfalama için)

  totalDataLength? = 0;

  public page? = 1;

  // Date Format
  dateFormat? = 'dd/MM/yyyy';

  // Table values
  currentItem?: any;
  currentColumnToSort?: FiTableCol;
  currentItemId?: number;
  showFilterRow? = true;  // false dı

  rowsFiltered?: any[] = [];
  rowsSliced?: any[] = [];


  /**
   *  Otomatik tüm sütunlar filtrelerini gösterir
   */
  filterAuto?: boolean;
  fiTableComp?:FiTableComponent;

  // for getter and setters
  private _rows?: any[] = [];
  private _columns?: FiTableCol[] = [];

  // sayfalama datası şeklinde
  dataPages?: any[][];

  // Template'den Enum ve Tiplere ulaşmak için tanımlandı.
  // fiEditorType? = FiEditorType;
  // fiColtype? = FiColType;
  // FiTableDataType? = FiTableDataType;
  //--------

  filterStatus? = true;

  // Pencerenin boyutuna göre template tasarımı için
  public innerWidth?: any;
  // enuma çevrilebilir
  public isWindowXs? = false;
  public isWindowLg? = false;
  isVirtualDataState?: boolean;

  //private rows?:any[];

  // setRows?(rowsData:any[]){
  //   this.rows= rowsData;
  // }



  // ngOnInit() {
  //
  //   console.log('ngOninit Fitable');
  //
  //   //this.onChangeTable(this.config);
  //   //this.rowsFiltered = this.rows;
  //   this.innerWidth = window.innerWidth;
  //
  //   if(innerWidth<600){
  //     this.isWindowXs=true;
  //   }else{
  //     this.isWindowLg=true;
  //   }
  //
  //   this.fimodal.fiTableComp = this;
  //   this.rows = this.fimodal.rows;
  //   this.columns = this.fimodal.columns;
  // }

  constructor() {

    if(!this.dataType){
      this.dataType = FiTableDataType.plainTable;
    }

    //   // FIXME class diger string olarak gönderilebilir
    //   // Classname array olarak gelmişse onlar birleştirilir.
    //   if (!fiModal.className) {
    //     fiModal.className = 'table-bordered';  // table-striped is removed.
    //   }
    //   if (fiModal.className instanceof Array) {
    //     fiModal.className = fiModal.className.join(' ');
    //   }
    //
    //   if (!fiModal.dataType) {
    //     fiModal.dataType = FiTableDataType.plainTable;
    //   }
    //
    //   fiModal.columns.forEach(value => {
    //
    //     if (fiModal.filterAuto) {
    //       value.filterable=true;
    //
    //       // @Deprecated
    //       if (!value.filtering) {
    //         value.filtering = new FiFilterBase();
    //
    //       }
    //     }
    //
    //   });
    //
    //   if (fiModal.pageSize) {
    //     this.pageSize = fiModal.pageSize;
    //   }
    //
    //   this._fimodal = fiModal;
    //
    //   //col ve row input ile almalı, burada alınca değişimleri takip etmiyor, non-reactive
    //   //this.columns = fiModal.columns;
    //   //this.rows = fiModal.rows;


  }

//@Input()
  public setRows?(rowsData: any[]) {

    console.log('Set Rows On FiTable');

    if (!rowsData) {
      return;
    }

    if (this.dataType === FiTableDataType.plainTable) { // sanal sayfalama yoksa filter and sort çalıştırır

      // 0 false olarak göründüğü,1 den başlatıldı.
      for (let index = 1; index <= rowsData.length; index++) {
        let element = rowsData[index - 1];
        element.fiIndex = index;
      }

      this._rows = rowsData;
      this.totalDataLength = rowsData.length;
      this.onFilterAndSortTable(null);
      // RowsData uzunluğu toplam uzunluk olarak alınır.

      return;

    }

    if (this.dataType === FiTableDataType.pagingWithLocalData) { // sanal sayfalama yoksa filter and sort çalıştırır

      // 0 false olarak göründüğü,1 den başlatıldı.
      for (let index = 1; index <= rowsData.length; index++) {
        let element = rowsData[index - 1];
        element.fiIndex = index;
      }

      this._rows = rowsData;
      this.totalDataLength = rowsData.length;
      this.onFilterAndSortTable(null);

      return;
    }

    if (this.dataType === FiTableDataType.pagingWithCachedData) { // Paging Virtual İse

      let currentPageLength: number = rowsData.length / this.pageSize;
      this.dataPages = [[]];

      for (let pageIndex = 1; pageIndex <= currentPageLength; pageIndex++) {
        this.dataPages[pageIndex] = this.sliceData(pageIndex, rowsData);
      }
      this.updateSlicedDataForCachePage(this.page);
      return;
    }

    console.log('Data Type Belirlenmemiş !!!');


  }

  public getRows?(): any[] {
    return this._rows;
  }

  public addCachePageData?(rowsData: any[], pageNo: number) {

    if (!rowsData) {
      return;
    }

    let startIndex = (pageNo - 1) * this.pageSize + 1;

    //let pageNoIndex = pageNo;

    for (let index = 0; index < rowsData.length; index++) {
      let element = rowsData[index];
      element.fiIndex = startIndex + index;

      if (this.dataPages[pageNo] === undefined) {
        this.dataPages[pageNo] = [];
      }

      let indexInPage = (element.fiIndex-1)%this.pageSize;
      this.dataPages[pageNo][indexInPage]=rowsData[index];

      if ((index + 1) % this.pageSize === 0) {
        pageNo++;
        this.dataPages[pageNo]=[];
      }
    }

    console.log('cache eklendi', rowsData);

    //this.dataPages[pageNo] = rowsData;

  }

  //@Input()
  public setColumns?(fiColumns: FiTableCol[]) {

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

    this._columns = fiColumns;

  }

  public getColumns?(): FiTableCol[] {
    return this._columns;
  }

  // public sanitize(html: string): SafeHtml {
  //   return this.sanitizer.bypassSecurityTrustHtml(html);
  // }

  public getConfigColumns?(): any {

    const sortColumns: any[] = [];

    this.getColumns().forEach((column: any) => {
      if (column.sortStatus) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  // sortchange için kullanılıyordu, değiştirildi, onsortchange metoduna yönlenir sort eylemi
  // public onChangeTable(column: FiTableCol): void {
  //
  //   this._columns.forEach((col: FiTableCol) => {
  //     if (col.field !== column.field && col.sortStatus !== false) {
  //       col.sortStatus = '';
  //     }
  //   });
  //
  //   this.tableChanged.emit({sorting: this.configColumns});
  // }

  public onFilterAndSortTable?(columnEdited: FiTableCol): void {

    // if (this.config.sorting) {
    // Object.assign(hedef,kaynaklar...)
    //   Object.assign(this.config.sorting, this.config.sorting);
    // }
    //console.log('rows:',this._rows );
    //console.log('config:', this.config);

    if (this.dataType === FiTableDataType.pagingWithCachedData) {
      //this.onSliceTable();
      return;
    }

    let filteredData = this.filterData(this._rows, this);

    let sortedData = this.sortData(filteredData, null);

    // FIXME buradaki eski yapı düzeltilmedi
    // this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;

    this.rowsFiltered = sortedData;

    // if (columnEdited !== null) {
    //   this.config.dataLength = this.rowsFiltered.length;
    // }

    this.onSliceTable();

    // FIXME buradaki eski yapı düzeltilmedi
    // this.length = sortedData.length;

    // this.tableChanged.emit({sorting: this.configColumns});
  }


  public onSortTable?(columnToSort: FiTableCol): void {

    this.currentColumnToSort = columnToSort;
    this.onFilterAndSortTable(null);

  }

  public sortData?(filteredData: any[],fiTableColToSort:FiTableCol ): any {

    let columnToSort = this.currentColumnToSort;

    let columnToSortName = '';

    if (this.currentColumnToSort !== undefined) {
      columnToSortName = this.currentColumnToSort.field;
    }

    // diger sütunların sorting durumu temizlenir.
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

    if (columnToSort === undefined) {
      return filteredData;
    }

    // if (!this.fimodal.sorting) {
    //   return filteredData;
    // }
    if (!columnToSort.sortable) {
      return filteredData;
    }

    const columns = this.sorting.columns || [];
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


  public filterData?(data: any, config: FiTableModal): any {

    let filteredData: any[] = data;

    //uncomm  -- aynı objeyi işaret ediyorlar
    //console.log('this columns:', this.columns );
    //console.log('config columns:', config.columns );

    this.getColumns().forEach((column: FiTableCol) => {

      if (!column.filterable) {
        return;
      }

      // false olanları filtreliyor,kaldırıyor, true olanlar kalıyor sadece
      filteredData = filteredData.filter((item: any) => {

        // filterstring yoksa filtreleme yapmıyor
        //if (!column.filtering.filterString) {
        if (!column.filterValue) {
          return true;
        }

        let cellValue = item[column.field].toLocaleLowerCase();

        if (column.colType === FiColType.date) {
          // TODO note pipe fonksiyon olarak kullanma : github
          cellValue = this.datepipe.transform(cellValue, this.dateFormat);
        }

        //return cellValue.match(column.filtering.filterString.toLocaleLowerCase());
        return cellValue.match(column.filterValue.toLocaleLowerCase());

      });
    });

    this.totalDataLength = filteredData.length;

    return filteredData;
  }

  public getData?(row: any, column: FiTableCol): string {

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

  // public onCellClick(row: any, column: any): void {
  //   //console.log('cell click event on Table Component');
  //   this.cellClicked.emit({row, column});
  // }

  // public onRowClick(event: any, item: any) {
  //   //FiLog(() => console.log('row click event:', item));
  //   FiLog(() => console.log('Fi Index', item.fiIndex));
  //   this.currentItem = item;
  //   this.currentItemId = item.fiIndex;
  // }

  // onChangePage(fiTableConf: FiTableConfig, $event: number, ngbPagination: NgbPagination, tableDiv: HTMLDivElement) {
  //
  //   //console.log('page:', this.page);
  //   //console.log('pageSize:', this.pageSize);
  //   //console.log('config:', fiTableConf);
  //
  //   this.rowsSliced = [];
  //
  //   let pageChangeEvent: FiEventPageChange = {config: fiTableConf, pageNumber: $event, tableDiv};
  //
  //   if (fiTableConf.dataType === FiTableDataType.pagingWithCachedData
  //     || fiTableConf.dataType === FiTableDataType.pagingWithRemoteData) {
  //     this.pageDataRequest.emit(pageChangeEvent);
  //   }
  //
  //   if (fiTableConf.dataType === FiTableDataType.pagingWithLocalData) {
  //     this.onSliceTable();
  //     tableDiv.scrollTop = 0;
  //   }
  //
  //   // After Page Change Event
  //   // if (fiTableConf.dataType === FiTableDataType.pagingWithCachedData) {
  //   //   this.showPage($event);
  //   //   tableDiv.scrollTop = 0;
  //   // }
  //
  //
  //   //this.tableDiv.scrollTop=0;
  //   //this.onSliceTable();
  //
  //   //listSlice(this.rows,this.page,this.pageSize)
  //
  //   //console.log('$event', $event);
  // }

  // editorUserRenderer(column: FiTableCol, row: any, cellValue: any, fiComp: any) {
  //
  //   if (column.editorRenderer) {
  //     column.editorRenderer(row, cellValue, fiComp);
  //   }
  //
  // }

  onFilterEnterAction?(column: FiTableCol, filterComp: HTMLInputElement) {
    if (column.filterEnterAction) {
      column.filterEnterAction(column, filterComp);
    }
  }


  // styleTableCell(fiTableTd: HTMLTableDataCellElement, column: FiTableCol) {
  //
  //   if (column.colType === FiColType.double || column.colType === FiColType.integer) {
  //     fiTableTd.style.textAlign = 'right';
  //   }
  //
  // }

  // styleTableRow(fiTableTr: HTMLTableRowElement, row: any) {
  //
  // }

  // styleFiTableHeader(fiTableHeader: HTMLTableHeaderCellElement, column: FiTableCol) {
  //
  //   if (column.prefSize) {
  //     //fiTableHeader.style.width = String(column.prefSize);
  //   }
  //
  // }

  toggleFiltre?() {
    this.filterStatus = FiBoolean.toggleBoolean(this.filterStatus);
  }

  public sliceData?(pageNo: number, data: any[]) {

    let startIndex = (pageNo - 1) * this.pageSize + 1; // 1--> 1 , 2 --> 31  (pagesize 30a göre)
    //let endIndex = startIndex + this.pageSize -1; // 1 --> 30 , 2--> 60
    let endIndex = pageNo * this.pageSize;  // 1--> 30 2-->60

    // array 0 'dan başladığı için
    let sliced = this.slicePipe.transform(data, startIndex-1, endIndex); // 0 dan başlıyor, endIndex dahil olmuyor

    for (let index = 0; index < sliced.length; index++) {
      let element = sliced[index];
      element.fiIndex = startIndex + index;
    }

    return sliced;
  }

  public onSliceTable?() {

    if (this.dataType === FiTableDataType.plainTable) { // sayfalama yapılmıyorsa
      this.rowsSliced = this.rowsFiltered;
      return;
    }


    if (this.dataType === FiTableDataType.pagingWithLocalData) {

      if(!this.rowsFiltered || this._rows.length===0) {
        return;
      }

      //if (this.rowsFiltered.length >= this.page * this.pageSize) {
      let startIndex = (this.page - 1) * this.pageSize + 1;
      let endIndex =  this.page * this.pageSize;  //startIndex + this.pageSize;
      this.rowsSliced = this.slicePipe.transform(this.rowsFiltered, startIndex-1, endIndex); // 0 dan başlıyor, endIndex dahil olmuyor
      return;
      //} else {
      //toastWarnFn('Data Eksik');
      //}


    }


    if (this.dataType === FiTableDataType.pagingWithCachedData) {

      this.updateSlicedDataForCachePage(this.page);

      // if (this._rows.length >= this.page * this.pageSize) {
      //
      //   console.log('Rows Sliced Paging Virtual');
      //
      //   let startIndex = (this.page - 1) * this.pageSize;
      //   let endIndex = startIndex + this.pageSize;
      //   this.rowsSliced = this.slicePipe.transform(this._rows, startIndex, endIndex);
      //
      // } else {
      //   //this.rowsSliced = this._rows;
      //   toastWarnFn('Data Eksik');
      // }

      return;
    }


    console.log('No Slicing Method');

  }

  // private sliceTableOld() {
  //
  //   if (!this.pagingDisable) {
  //
  //     if (this.fimodal.pagingWithCachedData) {
  //
  //       if (this._rows.length > this.page * this.pageSize) {
  //
  //         console.log('Rows Sliced Paging Virtual');
  //
  //         let startIndex = (this.page - 1) * this.pageSize;
  //         let endIndex = startIndex + this.pageSize;
  //         this.rowsSliced = this.slicePipe.transform(this._rows, startIndex, endIndex);
  //
  //       } else {
  //         this.rowsSliced = this._rows;
  //       }
  //
  //       // if (!this.isVirtualDataState) {
  //       //   //if (!this.fimodal.pagingVirtual) {
  //       //   let startIndex = (this.page - 1) * this.pageSize;
  //       //   let endIndex = startIndex + this.pageSize;
  //       //   this.rowsSliced = this.slicePipe.transform(this.rowsFiltered, startIndex, endIndex);
  //       //
  //       // } else {  // virtual data durumunda ise , sliced işlemi yapmaz
  //       //   this.rowsSliced = this.rowsFiltered;
  //       // }
  //
  //     } else {
  //       let startIndex = (this.page - 1) * this.pageSize;
  //       let endIndex = startIndex + this.pageSize;
  //       this.rowsSliced = this.slicePipe.transform(this.rowsFiltered, startIndex, endIndex);
  //     }
  //   } else {  // sayfalama yapılmıyorsa, rowsFiltered eşittir.
  //     this.rowsSliced = this.rowsFiltered;
  //   }
  //
  // }

  // getLength() {
  //   //console.log('Page Length Called',this.config.dataLength);
  //
  //   // if (this.fimodal.pagingWithCachedData) {
  //   //   return this.fimodal.dataLength;
  //   // }
  //
  //
  //   return this.rowsFiltered.length;
  //
  //   //return this.config.dataLength;
  // }

  // getTableHeight(): string {
  //
  //   if (this.fimodal.tableHeight) {
  //     return this.fimodal.tableHeight;
  //   }
  //
  //   return '70vh';
  //
  // }

  addRowToTop?(row: any) {
    this._rows.unshift(row);
    this.rowsSliced.unshift(row);
  }

  // refreshTable() {
  //   //this.changeDetectorRef.markForCheck();
  //   this.changeDetectorRef.detectChanges();
  // }

  // Draft
  // filterRow?(row: any) {
  //
  //   let tblCols = this.getColumns();
  //
  //
  // }

  public updateSlicedDataForCachePage?(pageNumber: number) {
    console.log('Show Page:', pageNumber);

    this.rowsSliced = this.dataPages[pageNumber];
  }

  checkPageEnable?():boolean {

    if(!this.dataType) {
      return false;
    }

    if(this.dataType===FiTableDataType.pagingWithLocalData
      || this.dataType===FiTableDataType.pagingWithCachedData
      || this.dataType===FiTableDataType.pagingWithRemoteData) {
      return true;
    }

    return false;

  }

  clearViewTable?() {
    this.rowsSliced = [];
  }

  setDataAndLength?(dataRows: any[], lnTotalLength: number) {

    this.setRows(dataRows);

    if(this.dataType === FiTableDataType.pagingWithCachedData){
      this.totalDataLength = lnTotalLength;
    }

  }


  buildConfig?(fiTblSimple: FiTableModalSimple) {

    if(fiTblSimple.className){
      this.className = fiTblSimple.className;
    }
    if(fiTblSimple.columns){
      this.setColumns(fiTblSimple.columns);
    }

    if(fiTblSimple.filterAuto){
      this.filterAuto = fiTblSimple.filterAuto;
    }

    if(fiTblSimple.pageSize){
      this.pageSize = fiTblSimple.pageSize;
    }

    if(fiTblSimple.tableHeight){
      this.tableHeight = fiTblSimple.tableHeight;
    }

    if(fiTblSimple.sorting){
      this.sorting = fiTblSimple.sorting;
    }

    if(fiTblSimple.dataType){
      this.dataType = fiTblSimple.dataType;
    }

    return this;

  }
}
