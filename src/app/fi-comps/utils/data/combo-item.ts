export class ComboItem {
  label:any;
  value:any;

  constructor() {  }

  static build(prmValue:string,prmLabel:string) {
    let comboitem = new ComboItem();

    comboitem.label = prmLabel;
    comboitem.value = prmValue;

    return comboitem;

  }


}
