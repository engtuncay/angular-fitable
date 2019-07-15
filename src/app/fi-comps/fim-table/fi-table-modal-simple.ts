import {FiTableCol} from '../fi-table/fi-table-col';
import {FiTableDataType} from '../fi-table/FiTableEnums';

export interface FiTableModalSimple {
  filterAuto?: boolean;
  sorting?: any;
  className?: any;
  pageSize?: number;
  tableHeight?: string;
  columns?:FiTableCol[];
  dataType?:FiTableDataType;
}
