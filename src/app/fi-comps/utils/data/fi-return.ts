export class FiReturn {

  blResult: boolean;
  obReturn: any;   // T
  txErrorMsgShort: string;
  txErrorMsgDetail: string;
  lnRowsAffected: number;
  obResponse: any;    //System.Object
  lnIdAffected: number;

  static factoryErrorShort(txErrorMsgShort: string) {
    let fiReturn = new FiReturn();
    fiReturn.txErrorMsgShort = txErrorMsgShort;
    return fiReturn;
  }

}

