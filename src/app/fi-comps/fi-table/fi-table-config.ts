import {FiTableCol} from './fi-table-col';
import {FiFilter} from './fi-filter';

export class FiTableConfig {

  /**
   * Paging properties
   */
  pagingDisable?: boolean;
  pageSize?: number;
  pagingVirtual?:boolean;
  dataLength?: number;

  tableHeight?:string;
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
  /**
   *  Otomatik tüm sütunlar filtrelerini gösterir
   */
  filterAuto?: boolean;


}
