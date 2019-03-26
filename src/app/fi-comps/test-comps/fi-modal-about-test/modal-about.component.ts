import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-modal-about',
  template: `
    <fimodal-wrapper [title]="title">
      <app-about #refModal></app-about>
    </fimodal-wrapper>`,
})
export class ModalAboutComponent implements OnInit {

  title = '';
  @ViewChild('refModal') refModal;

  constructor() {
  }

  ngOnInit() {
  }


}
