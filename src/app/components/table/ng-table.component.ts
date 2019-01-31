import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FiColType } from './FiColType';
import { FiTableCol,FiTableConfig } from './FiTableInterfaces';

@Component({
  selector: 'ng-table',
  styleUrls: ['./ng-table.css'],
  templateUrl: './fi-table.component.html',
})
export class NgTableComponent {

  // Input and Outputs(Events)

  // Table'ın Datası rows alanındadır.
  @Input() public rows:Array<any> = [];

  @Output() public tableChanged:EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked:EventEmitter<any> = new EventEmitter();

  // Table values
  ozcoltype = FiColType;

  public currentItem:any;
 
  @Input()
  public set config(conf:FiTableConfig) {
    
    // FIXME class diger string olarak gönderilebilir
    // Classname array olarak gelmişse onlar birleştirilir.
    if (!conf.className) {
      conf.className = 'table-bordered';  //table-striped 
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }
    
    this._config = conf;
  }

  public showFilterRow:Boolean = false;

  private _columns:Array<FiTableCol> = [];
  private _config:FiTableConfig = {};

  @Input()
  public set columns(fiColumns:Array<FiTableCol>) {
    
    fiColumns.forEach((value:FiTableCol) => {
      
      if (value.filtering) {
        this.showFilterRow = true;
      }

      if (value.className && value.className instanceof Array) {
        value.className = value.className.join(' ');
      }

      let column = this._columns.find((col:any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });

  }

  
  public constructor(private sanitizer:DomSanitizer) {
  }

  public sanitize(html:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public get columns():Array<FiTableCol> {
    return this._columns;
  }

  public get config():FiTableConfig {
    return this._config;
  }

  public get configColumns():any {
    
    let sortColumns:Array<any> = [];

    this.columns.forEach((column:any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  // sortchange için kullanılıyordu, değiştirildi, onsortchange metoduna yönlenir sort eylemi
  public onChangeTable(column:FiTableCol):void {

    this._columns.forEach((col:FiTableCol) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });

    this.tableChanged.emit({sorting: this.configColumns});
  }

  public onSortTable(column:FiTableCol):void {

    // diger sütunlar sort alanı(property) temizlenir.
    this._columns.forEach((col:FiTableCol) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });

    // Sorting mekanizması
    if ( this.config.filtering) {
      Object.assign(this.config.filtering, this.config.filtering);
    }

    if (this.config.sorting) {
      Object.assign(this.config.sorting, this.config.sorting);
    }

    let filteredData = this.changeFilter(this.rows, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    //FIXME buradaki eski yapı düzeltilmedi
    //this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.rows = sortedData;
    //FIXME buradaki eski yapı düzeltilmedi
    //this.length = sortedData.length;

    //this.tableChanged.emit({sorting: this.configColumns});
  }

  public changeSort(data:any, config:any):any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName:string = void 0;
    let sort:string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  

  public changeFilter(data:any, config:any):any {

    let filteredData:Array<any> = data;
    this.columns.forEach((column:any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item:any) => {
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item:any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.columns.forEach((column:any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
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

  public getData(row:any, column: FiTableCol):string {

    let propertyName:string = column.name;    
    let cellvalue = propertyName.split('.').reduce((prev:any, curr:string) => prev[curr], row);

    if(column.colType == FiColType.double && cellvalue !== undefined){
      cellvalue= cellvalue.toFixed(2);
    }

    if(column.colType ==FiColType.boolean){
      
    }

    return cellvalue;
  }

  public cellClick(row:any, column:any):void {
    console.log("cell click event on Table Component");
    this.cellClicked.emit({row, column});
  }

  public rowClick(event:any,item:any){
    console.log('row click event:');
    console.log(event);
    this.currentItem = item;
  }


}
