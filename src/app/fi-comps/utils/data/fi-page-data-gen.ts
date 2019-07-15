export class FiPageDataGen<T> {

  blResult: boolean;
  obReturn: T[];   // T
  txErrorMsgShort: string;
  txErrorMsgDetail: string;
  lnRowsAffected: number;
  //obResponse: any[];    //System.Object
  lnTotalLength?:number;
  lnPageNumber?:number;

  static factoryErrorShort(txErrorMsgShort: string) {
    let fiReturn = new FiPageDataGen();
    fiReturn.txErrorMsgShort = txErrorMsgShort;
    return fiReturn;
  }

}

