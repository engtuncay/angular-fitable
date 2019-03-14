import {OzField} from './OzField';
import {FiTableCol} from '../../fi-table/fi-table-col';

export function convertFiTableCol(fieldobj: OzField): FiTableCol {

    let tableCol = new FiTableCol();
    tableCol.field = fieldobj.field;
    tableCol.title = fieldobj.header;
    return tableCol;

}







