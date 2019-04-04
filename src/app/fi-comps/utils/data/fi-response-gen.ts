export class FiResponseGen<T> {

  blResult: boolean;
  obReturn: T;   // T
  txErrorMsgShort: string;
  txErrorMsgDetail: string;
  lnRowsAffected: number;
  obResponse: any;    //System.Object
  lnIdAffected: number;
  lnTotalLength?:number;

  static factoryErrorShort(txErrorMsgShort: string) {
    let fiReturn = new FiResponseGen<boolean>();
    fiReturn.txErrorMsgShort = txErrorMsgShort;
    return fiReturn;
  }

}

