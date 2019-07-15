import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {FiTableModal} from '../fim-table/fi-table-modal';

export class FiEventPageChange {

  tableModal?:FiTableModal;
  pageNumber?:number;
  ngbPagination?:NgbPagination;
  tableDiv?:HTMLDivElement;

}
