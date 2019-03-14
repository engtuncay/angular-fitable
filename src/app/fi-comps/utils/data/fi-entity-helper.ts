import {FiForm} from '../../fi-form/fi-form';
import {FiTableCol} from '../../fi-table/fi-table-col';


export class FiEntityHelper {

  convertEntity<T>(ficolumns: FiTableCol[]):T {
    let entity = {} as T;

    for(let column of ficolumns) {
      entity[column.field] = column.editorValue;
    }

    return entity;
  }



}
