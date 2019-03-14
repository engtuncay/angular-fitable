import {FiTableCol} from './fi-table-col';
import {FiFilter} from './fiTableInterfaces';

export class FiTableConfig {

  /**
   *
   */
  paging?: boolean;
  pageSize?: number;

  /**
   * Type: Any = Boolean or String
   *
   * if defined , sorting will be done
   * Sort ype is identified as asc,desc,...
   *
   * Sorting yapılıp yapılmayacağına veya
   * Sorting tipini (asc veya desc) belirtir
   */
  sorting?: any;

  /**
   *
   */
  //filtering?: FiFilter;

  /**
   * Table alacağı stil sınıfları
   * Tek String veya String array oluyor
   */
  className?: any;

  /**
   * FIXME zorunlu olması lazım
   * Tablonun sütunları
   */
  columns?: FiTableCol[];
  rows?: any[];
  filterAll?: FiFilter;
  filterAuto?: boolean;


}
