import {FiTableCol} from '../fi-table/fi-table-col';


export class FiForm {

  columns?: FiTableCol[];

  convertEntity?<T>(): T {

    let entity = {} as T;

    for (let column of this.columns) {
      entity[column.field] = column.editorValue;
    }

    return entity;
  }

  bindEntityToForm?<T>(entity: T) {

    for (let column of this.columns) {
      column.editorValue = entity[column.field];
    }

    console.log('Columns After Bind (bind-entity-to-form)', this.columns);

  }

  public convertObject?():any {

    let entity = {};

    for (let column of this.columns) {
      entity[column.field] = column.editorValue;
    }

    return entity;

  }

}

