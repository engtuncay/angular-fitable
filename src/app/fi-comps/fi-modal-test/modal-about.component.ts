import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-modal-about',
  template: `
    <fimodal [title]="title">
      <app-about #refModal></app-about>
    </fimodal>`,
})
export class ModalAboutComponent implements OnInit {

  title = '';
  @ViewChild('refModal') refModal;

  constructor() {
  }

  ngOnInit() {
  }


}
