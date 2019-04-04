import {DatePipe} from '@angular/common';


export class FiCalendar {

  bufferDate:Date;
  locale = 'en-US';

  constructor(){ }

  public static build() {
    return new FiCalendar();
  }

  buildYearFirstDay(){
    let customDate = new Date(new Date().getFullYear(), 0, 1);
    this.bufferDate = customDate;
    return this;
  }

  buildYearLastDay(){
    let customDate = new Date(new Date().getFullYear(), 11, 31);
    this.bufferDate = customDate;
    return this;
  }

  getBufferDate(){
    return this.bufferDate;
  }

  getStdStringDate(){
    let dateFormat = 'yyyy-MM-dd';
    let datepipe = new DatePipe(this.locale);
    return datepipe.transform(this.bufferDate,dateFormat);
  }

}

