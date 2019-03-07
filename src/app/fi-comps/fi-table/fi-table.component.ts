import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FiColType } from './fiColType';
import { FiTableCol, FiTableConfig } from './fiTableInterfaces';

@Component({
  selector: 'fi-table',
  styleUrls: ['./fi-table.css'],
  templateUrl: './fi-table.component.html',
})
export class FiTableComponent implements OnInit {

  // Input and Outputs(Events)

  // Table'ın Datası rows alanındadır.
  // @Input() public rows: Array<any> = [];
  @Input() public allowRemoteFilter = false;

  public rowsFiltered: any[] = [];
  private _rows:any[] = [];

  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked: EventEmitter<any> = new EventEmitter();

  // Table values
  ozcoltype = FiColType;

  public page = 1;
  public itemsPerPage = 10;
  public maxSize = 5;
  public numPages = 1;
  public length = 0;

  public currentItem: any;
  public currentColumnToSort: FiTableCol;

  public showFilterRow: Boolean = false;

  private _columns: FiTableCol[] = [];
  private _config: FiTableConfig = {};

  public constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    //this.onChangeTable(this.config);
    //this.rowsFiltered = this.rows;
  }

  @Input()
  public set rows(rowsData: any[]) {

    for (let index = 0; index < rowsData.length; index++) {
      const element = rowsData[index];
      element.fiIndex = index+1;
    }

    this._rows = rowsData;
    this.rowsFiltered = rowsData;
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

    this._config = conf;
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

      const column = this._columns.find((col: any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });

  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public get columns(): FiTableCol[] {
    return this._columns;
  }

  public get config(): FiTableConfig {
    return this._config;
  }

  public get configColumns(): any {

    const sortColumns: any[] = [];

    this.columns.forEach((column: any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  // sortchange için kullanılıyordu, değiştirildi, onsortchange metoduna yönlenir sort eylemi
  public onChangeTable(column: FiTableCol): void {

    this._columns.forEach((col: FiTableCol) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });

    this.tableChanged.emit({sorting: this.configColumns});
  }

  public onFilterSortTable(): void {

    //console.log('Filter and Sort');

    let columnToSort = this.currentColumnToSort;

    let columnToSortName = '';

    if(this.currentColumnToSort!=undefined) {
      columnToSortName = this.currentColumnToSort.name;
    }

    // diger sütunlar sort alanı(property) temizlenir.
    this._columns.forEach((col: FiTableCol) => {
      
      let colNameBinded= false;

      if (!colNameBinded && columnToSortName =='') {
        col.sort='';
        colNameBinded=true;
      }

      if (!colNameBinded && col.name !== columnToSortName && col.sort !== false) {
        col.sort = '';
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

    const filteredData = this.changeFilter(this._rows, this.config);
    const sortedData = this.changeSort(filteredData, columnToSort);
    // FIXME buradaki eski yapı düzeltilmedi
    // this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.rowsFiltered = sortedData;
    // FIXME buradaki eski yapı düzeltilmedi
    // this.length = sortedData.length;

    // this.tableChanged.emit({sorting: this.configColumns});
  }


  public onSortTable(columnToSort: FiTableCol): void {

    this.currentColumnToSort = columnToSort;

    this.onFilterSortTable();

  }

  public changeSort(filteredData: any[], columnToSort: FiTableCol): any {

    if(columnToSort==undefined) {
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

    console.log(columnToSort);

    // if(columnToSort.sort==false){
    //   return data;
    // }

    if (columnToSort.sort === '') {
        // console.log('fi Index set');
        columnName = 'fiIndex';
        sort = 'asc';
    }

    if (columnToSort.sort !== '' && columnToSort.sort !== false) {
      columnName = columnToSort.name;
      sort = columnToSort.sort;
    }

    if (!columnName) {
      return filteredData;
    }

    // console.log(filteredData);

    // if (filteredData[0].fiIndex === undefined) {
    //   console.log('fi Index baglandı');
    //   for (let index = 0; index < filteredData.length; index++) {
    //     const element = filteredData[index];
    //     element.fiIndex = index;
    //   }

    // }

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



  public changeFilter(data: any, config: any): any {

    let filteredData: any[] = data;

    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].toLocaleLowerCase().match(column.filtering.filterString.toLocaleLowerCase());
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].toLocaleLowerCase().match(this.config.filtering.filterString.toLocaleLowerCase()));
    }

    const tempArray: any[] = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columns.forEach((column: any) => {
        //if (item[column.name].toString().match(this.config.filtering.filterString)) {
        //console.log('303 ngtablecomp');
        //console.log(item[column.name].toString().toLocaleLowerCase());
        //console.log(this.config.filtering.filterString.toLocaleLowerCase());
        if (item[column.name].toString().toLocaleLowerCase().match(this.config.filtering.filterString.toLocaleLowerCase())) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public getData(row: any, column: FiTableCol): string {

    const propertyName: string = column.name;
    let cellvalue = propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);

    if (column.colType === FiColType.double && cellvalue !== undefined) {
      cellvalue = cellvalue.toFixed(2);
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


}
