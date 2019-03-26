import {FiTableCol} from '../../fi-table/fi-table-col';
import {IFiField} from './i-fi-field';


export class FiTableHelper {

  static build(): FiTableHelper {
    return new FiTableHelper();
  }

  findColumnByFiField(ficolumns: FiTableCol[], field: IFiField): FiTableCol {

    return ficolumns.find(value => {
      return value.field === field.field;
    });

  }

  findColumnByField(ficolumns: FiTableCol[], field: string): FiTableCol {

    return ficolumns.find(value => {
      return value.field === field;
    });

  }


}
