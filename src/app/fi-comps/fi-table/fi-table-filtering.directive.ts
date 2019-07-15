import { Directive, EventEmitter, ElementRef, Renderer, HostListener, Input, Output } from '@angular/core';
import {FiFilter} from './fi-filter';
import {FiTableCol} from './fi-table-col';

// import {setProperty} from 'angular2/ts/src/core/forms/directives/shared';
function setProperty(renderer:Renderer, elementRef:ElementRef, propName:string, propValue:any):void {
  renderer.setElementProperty(elementRef, propName, propValue);
}

@Directive({selector: '[ngTableFiltering]'})
export class FiTableFilteringDirective {
  // @Input() public ngTableFiltering:FiFilter = {
  //   filterString: '',
  //   columnName: 'name'
  // };

  @Input () public ngTableFiltering:FiTableCol;

  @Output() public filterChanged:EventEmitter<any> = new EventEmitter();

  @Input()
  public get config():any {
    return this.ngTableFiltering;
  }

  public set config(value:any) {
    this.ngTableFiltering = value;
  }

  private element:ElementRef;
  private renderer:Renderer;

  @HostListener('input', ['$event.target.value'])
  public onChangeFilter(inputValue:any):void {
    //console.log('on Change Filter çalışti :', this.ngTableFiltering );
    //this.ngTableFiltering.filterString = inputValue;
    this.ngTableFiltering.filterValue = inputValue;
    this.filterChanged.emit({filtering: this.ngTableFiltering});
  }

  public constructor(element:ElementRef, renderer:Renderer) {
    this.element = element;
    this.renderer = renderer;
    // Set default value for filter
    // if(this.ngTableFiltering.filterValue){
    //   setProperty(this.renderer, this.element, 'value', this.ngTableFiltering.filterValue);
    // }

  }
}
