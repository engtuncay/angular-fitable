import { FiColType } from "./fiColType";

export interface FiTableCol {

    title: string;
    name: string;
    filtering?: any;
    sort?: any;
    className?: any;
    colType?: FiColType;
    colClassName?: string;
    sortPrevious?: string;

}

export interface FiFilter {

    filterString?: string;
    placeholder?: string;

}

export interface FiTableConfig {

    /**
     * 
     */
    paging?: boolean,
    
    /**
     * Type: Any = Boolean or String
     * 
     * Sorting yapılıp yapılmayacağına veya
     * Sorting tipini (asc veya desc) belirtir
     */
    sorting?: any,
    
    /**
     * 
     */
    filtering?: FiFilter;
    
    /**
     * Table alacağı stil sınıfları
     * Tek String veya String array oluyor
     */
    className?: any;

}
