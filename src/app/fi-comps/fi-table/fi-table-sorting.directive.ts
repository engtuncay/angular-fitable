import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FiTableConfig} from './fi-table-config';
import {FiTableCol} from './fi-table-col';

@Directive({selector: '[fiTableSorting]'})
export class FiTableSortingDirective {

  @Input() public fiTableSorting:FiTableConfig;
  @Input() public column:FiTableCol;

  @Output() public sortChanged:EventEmitter<any> = new EventEmitter();

  @Input()
  public get config():any {
    return this.fiTableSorting;
  }

  public set config(value:any) {
    this.fiTableSorting = value;
  }

  /**
   * Üç tip arasında geçiş(toggle) yapmaktır. 
   * asc -> desc -> '' 
   *  
   * @param event Mouse event
   */
  @HostListener('click', ['$event'])
  public onToggleSort(event:any):void {

    //console.log("sort directive on header clicked");
    if (event) {
      // TODO search:preventDefault ne işe yarıyor
      event.preventDefault();
    }



    if (this.fiTableSorting && this.column && this.column.sort !== false) {

      this.column.sortPrevious= this.column.sort;

      switch (this.column.sort) {
        case 'asc':
          this.column.sort = 'desc';
          break;
        case 'desc':
          this.column.sort = '';
          break;
        default:
          this.column.sort = 'asc';
          break;
      }

      this.sortChanged.emit(this.column);
    }
  }
}
