import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FiTableFilteringDirective} from './fi-table-filtering.directive';
import {FiTablePagingDirective} from './fi-table-paging.directive';
import {FiTableSortingDirective} from './fi-table-sorting.directive';
import {FiTableComponent} from './fi-table.component';
import {FormsModule} from '@angular/forms';
import {FiTableCellComponent} from './fi-table-cell.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {AppModule} from '../../app.module';
import {FiPagingComponent} from '../fi-paging/fi-paging.component';

@NgModule({
  imports: [CommonModule, NgbModule, FormsModule, NgSelectModule],
  declarations: [FiTableComponent, FiTableFilteringDirective, FiTablePagingDirective, FiTableSortingDirective,FiTableCellComponent,FiPagingComponent],
  exports: [FiTableComponent, FiTableFilteringDirective, FiTablePagingDirective, FiTableSortingDirective,FiTableCellComponent,FiPagingComponent]
})
export class Ng2TableModule {
}
