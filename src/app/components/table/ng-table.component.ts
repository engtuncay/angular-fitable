import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FiColType } from './FiColType';

@Component({
  selector: 'ng-table',
  styleUrls: ['./ng-table.css'],
  templateUrl: './fi-table.component.html',
})
export class NgTableComponent {

  // Input and Outputs(Events)

  @Input() public rows:Array<any> = [];

  @Output() public tableChanged:EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked:EventEmitter<any> = new EventEmitter();


  // Table values
  ozcoltype = FiColType;

  public currentItem:any;
 
  @Input()
  public set config(conf:any) {
    if (!conf.className) {
      conf.className = 'table-bordered';  //table-striped 
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }
    this._config = conf;
  }

  

  public showFilterRow:Boolean = false;

  private _columns:Array<any> = [];
  private _config:any = {};

  @Input()
  public set columns(values:Array<any>) {
    values.forEach((value:any) => {
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

  public get columns():Array<any> {
    return this._columns;
  }

  public get config():any {
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

  public onChangeTable(column:any):void {
    this._columns.forEach((col:any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });

    this.tableChanged.emit({sorting: this.configColumns});
  }

  public getData(row:any, column):string {
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
    this.cellClicked.emit({row, column});
  }

  public rowClick(event:any,item:any){
    console.log('event');
    console.log(event);
    this.currentItem = item;
  }


}
