import {IFiField} from './i-fi-field';
import {ComboItem} from './combo-item';


export function ComboHelper( rows:any, key:IFiField, label:IFiField):ComboItem[] {

  let comboArr: ComboItem[] =[];

  for(let row of rows) {
    comboArr.push(ComboItem.build(row[key.field],row[label.field]));
  }

  return comboArr;

}
