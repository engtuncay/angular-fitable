export class FiString {


  static isEmpty(value:string):boolean{

    if(value===undefined) { return true; }
    if(value===null) { return true; }
    if(value==='') { return true; }

    return false;
  }
}
