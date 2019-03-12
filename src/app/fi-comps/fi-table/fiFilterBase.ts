import {FiFilter} from './fiTableInterfaces';

export class FiFilterBase implements FiFilter {

    filterString?: string;
    placeholder?: string;
    columnName?:string;
    filterValue?:string;

}
