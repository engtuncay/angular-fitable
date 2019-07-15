export class FiPageData {

  blResult: boolean;
  obReturn: any[];   // T
  txErrorMsgShort: string;
  txErrorMsgDetail: string;
  lnRowsAffected: number;
  //obResponse: any[];    //System.Object
  lnTotalLength?:number;
  lnPageNumber?:number;

  static factoryErrorShort(txErrorMsgShort: string) {
    let fiReturn = new FiPageData();
    fiReturn.txErrorMsgShort = txErrorMsgShort;
    return fiReturn;
  }

}

