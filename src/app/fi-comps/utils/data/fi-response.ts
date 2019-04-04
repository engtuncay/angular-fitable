export class FiResponse {

  blResult: boolean;
  obReturn: any;   // T
  txErrorMsgShort: string;
  txErrorMsgDetail: string;
  lnRowsAffected: number;
  obResponse: any;    //System.Object
  lnIdAffected: number;
  lnTotalLength?:number;

  static factoryErrorShort(txErrorMsgShort: string) {
    let fiReturn = new FiResponse();
    fiReturn.txErrorMsgShort = txErrorMsgShort;
    return fiReturn;
  }

}

