// import {FiTableCol} from './fi-table-col';
// import {FiFilter} from './fi-filter';
// import {FiTableComponent} from './fi-table.component';
// import {FiTableDataType} from './FiTableEnums';
//
// export class FiTableConfig {
//
//   /**
//    * Paging properties
//    */
//
//   pagingDisable?: boolean;
//   pageSize?: number;
//   pagingWithCachedData?: boolean;
//   pagingWithRemoteData?:boolean;
//   dataLength?: number;
//   dataType?:FiTableDataType;
//
//
//   /**
//    * it should be vh scale
//    * Example : 70vh (default)
//    */
//   tableHeight?: string;
//   /**
//    * Type: Any = Boolean or String
//    *
//    * if defined , sorting will be done
//    * Sort ype is identified as asc,desc,...
//    *
//    * Sorting yapılıp yapılmayacağına veya
//    * Sorting tipini (asc veya desc) belirtir
//    */
//   sorting?: any;
//
//   /**
//    *
//    */
//   //filtering?: FiFilter;
//
//   /**
//    * Table alacağı stil sınıfları
//    * Tek String veya String array oluyor
//    */
//   className?: any;
//
//   /**
//    * FIXME zorunlu olması lazım
//    * Tablonun sütunları
//    */
//   columns?: FiTableCol[];
//   //rows?: any[];
//   filterAll?: FiFilter;
//   /**
//    *  Otomatik tüm sütunlar filtrelerini gösterir
//    */
//   filterAuto?: boolean;
//   fiTableComp?: FiTableComponent;
//
//   rows?: any[];
//
//   setRows?(rowsData: any[]) {
//     this.rows = rowsData;
//   }
//
// }
