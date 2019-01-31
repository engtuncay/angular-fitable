import { Directive, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { FiTableConfig, FiTableCol } from './FiTableInterfaces';

@Directive({selector: '[ngTableSorting]'})
export class NgTableSortingDirective {

  @Input() public ngTableSorting:FiTableConfig;
  @Input() public column:FiTableCol;

  @Output() public sortChanged:EventEmitter<any> = new EventEmitter();

  @Input()
  public get config():any {
    return this.ngTableSorting;
  }

  public set config(value:any) {
    this.ngTableSorting = value;
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

    if (this.ngTableSorting && this.column && this.column.sort !== false) {

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
