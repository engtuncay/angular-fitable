import {FiTableCol} from '../fi-table/fi-table-col';
import {FiFilter} from '../fi-table/fi-filter';
import {FiTableComponent} from '../fi-table/fi-table.component';

export class FiTableModel {

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
  //rows?: any[];
  filterAll?: FiFilter;
  /**
   *  Otomatik tüm sütunlar filtrelerini gösterir
   */
  filterAuto?: boolean;
  fiTableComp?:FiTableComponent;

  private rows?:any[];

  setRows?(rowsData:any[]){
    this.rows= rowsData;
  }

}
