import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'fimodal-inner',
  templateUrl: './fimodalinner.component.html',
  styleUrls: ['./fimodal.component.css'],
})
export class FimodalInnerComponent implements OnInit {

  @Input() title = `Information`;
  @Input() fiModal: NgbActiveModal;

  // @ViewChild('modalContent') content

  constructor(public activeModal: NgbActiveModal) {
  }  // public activeModal: NgbActiveModal

  ngOnInit() {
  }

  closeModal() {
    //console.log(this.fiModal);
    //console.log(this.activeModal);
    //this.activeModal.dismiss('Cross click');
    //this.fiModal.dismiss('Cross click');
    this.activeModal.dismiss('Cross Click');
    //modal.dismiss('Cross click')
  }

}

