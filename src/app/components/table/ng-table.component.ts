import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FiColType } from './FiColType';

@Component({
  selector: 'ng-table',
  styleUrls: ['./ng-table.scss'],
  template: `
    <table class="table dataTable" ngClass="{{config.className || ''}}"
           role="grid" style="width: 100%;">
      <thead>
        <tr role="row">
          <th *ngFor="let column of columns" [ngTableSorting]="config" [column]="column" 
              (sortChanged)="onChangeTable($event)" ngClass="{{column.className || ''}}">
            {{column.title}}
            <i *ngIf="config && column.sort" class="pull-right fa"
              [ngClass]="{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}"></i>
          </th>
        </tr>
      </thead>
      <tbody>
      <tr *ngIf="showFilterRow">
        <td *ngFor="let column of columns">
          <input *ngIf="column.filtering" placeholder="{{column.filtering.placeholder}}"
                 [ngTableFiltering]="column.filtering"
                 class="form-control"
                 style="width: auto;"
                 (tableChanged)="onChangeTable(config)"/>
        </td>
      </tr>
        <tr *ngFor="let row of rows" [class.active]="currentItem===row" (click)="rowClick($event,row)">
          
        <td (click)="cellClick(row, column.name)" *ngFor="let column of columns"  ngClass="{{column.colClassName || ''}}">
          <span *ngIf="column.colType!=ozcoltype.boolean">
            <span [innerHtml]="sanitize(getData(row, column))"></span>
          </span>        
                    
          <span *ngIf="column.colType==ozcoltype.boolean">
              <input type="checkbox" [value]="row[column.name]">          
          </span>        

          </td>
        </tr>
      </tbody>
    </table>
  `
  
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
    this.currentItem = item;
  }


}
