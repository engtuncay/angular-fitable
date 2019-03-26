import {FiField} from './fi-field';
import {FiTableCol} from '../../fi-table/fi-table-col';

export function convertFiTableCol(fieldobj: FiField): FiTableCol {

    let tableCol = new FiTableCol();
    tableCol.field = fieldobj.field;
    tableCol.header = fieldobj.header;
    return tableCol;

}







