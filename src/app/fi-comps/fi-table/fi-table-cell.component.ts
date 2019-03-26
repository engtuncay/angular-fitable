import {Component, Input} from '@angular/core';
import {FiTableCol} from './fi-table-col';
import {FiColType, FiEditorType} from './FiTableEnums';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';


@Component({
    selector: 'fi-table-cell',
    styleUrls: ['./fi-table-cell.css'],
    templateUrl: './fi-table-cell.component.html'
  }
)
export class FiTableCellComponent {

  @Input() column: FiTableCol;
  @Input() row: any;

  fiEditorType = FiEditorType;
  fiColtype = FiColType;
  dateFormat = 'dd/MM/yyyy';

  constructor(private sanitizer: DomSanitizer, private datepipe: DatePipe) {

  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getData(row: any, column: FiTableCol) {
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

    if (column.colType === FiColType.date) {

    }

    return cellvalue;

  }


  editorUserRenderer(column: FiTableCol, row: any, cellValue: any, fiComp: any) {

    if (column.editorRenderer) {
      column.editorRenderer(row, cellValue, fiComp);
    }

  }
}
