import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FiTableFilteringDirective } from './fi-table-filtering.directive';
import { FiTablePagingDirective } from './fi-table-paging.directive';
import { FiTableSortingDirective } from './fi-table-sorting.directive';
import { FiTableComponent } from './fi-table.component';

@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [FiTableComponent, FiTableFilteringDirective, FiTablePagingDirective, FiTableSortingDirective],
  exports: [FiTableComponent, FiTableFilteringDirective, FiTablePagingDirective, FiTableSortingDirective]
})
export class Ng2TableModule {
}
