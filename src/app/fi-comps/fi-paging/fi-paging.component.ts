import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-fi-paging',
  templateUrl: './fi-paging.component.html',
  styleUrls: ['./fi-paging.component.scss']
})
export class FiPagingComponent implements OnInit {

  @Output() pageRequest: EventEmitter<any> = new EventEmitter();

  @Input()
  totalLength =1;
  showLength=10;
  numbers;
  Math = Math;
  pageActive=1;

  constructor() { }

  ngOnInit() {
  }

  getData() {
    //' a'.repeat(Math.min(totalLength,showLength)
    let res = [];
    for (let i = 1; i <= Math.min(this.totalLength,this.showLength) ; i++) {
      res.push(i);
    }
    return res;
  }

  onPageRequest(page: any) {
    console.log('page', page);
    this.pageRequest.emit(page);
  }
}
