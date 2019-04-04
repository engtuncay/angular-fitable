
export class FiNumber {


  public static isEmpty(value: number):boolean {
    if(value===undefined) { return true; }
    if(value===null) { return true; }
    return false;
  }
}
