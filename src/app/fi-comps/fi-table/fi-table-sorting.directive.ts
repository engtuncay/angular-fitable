import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FiTableCol} from './fi-table-col';
import {FiTableModal} from '../fim-table/fi-table-modal';

@Directive({selector: '[fiTableSorting]'})
export class FiTableSortingDirective {

  @Input() public fiTableSorting:FiTableModal;
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



    if (this.fiTableSorting && this.column && this.column.sortStatus !== false) {

      this.column.sortPrevious= this.column.sortStatus;

      switch (this.column.sortStatus) {
        case 'asc':
          this.column.sortStatus = 'desc';
          break;
        case 'desc':
          this.column.sortStatus = '';
          break;
        default:
          this.column.sortStatus = 'asc';
          break;
      }

      this.sortChanged.emit(this.column);
    }
  }
}
