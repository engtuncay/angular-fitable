import {FiTableConfig} from './fi-table-config';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';

export class FiEventPageChange {

  config?:FiTableConfig;
  pageNumber?:number;
  ngbPagination?:NgbPagination;

}
