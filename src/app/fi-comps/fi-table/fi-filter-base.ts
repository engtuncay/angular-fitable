import {FiFilter} from './fi-filter';

export class FiFilterBase implements FiFilter {

    filterString?: string;
    placeholder?: string;
    columnName?:string;
    filterValue?:string;

}
