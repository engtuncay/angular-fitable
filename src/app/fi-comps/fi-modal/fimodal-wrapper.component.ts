import { Component, Input, OnInit, ViewChild } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

// Componenti Modal Dialoga çevirmeye yarayan component

@Component({
  selector: 'fimodal-wrapper',
  styleUrls: ['./fimodal-wrapper.component.css'],
  template: `
    <!-- appmodal -->
    <!--<div role="document" class="modal-dialog">-->
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">{{title}}</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <ng-content></ng-content>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Kapat</button>
        <!-- <button type="button" class="btn btn-outline-dark" (click)="fiModal.close('Close click')">fiModal.close</button> -->
      </div>
      
    </div>
    <!--</div>-->
  `,
})
export class FimodalWrapperComponent implements OnInit {

  @Input() title = '';
  //@ViewChild('modalContent') content

  // ,public modalService: NgbModal

  constructor(public activeModal: NgbActiveModal) {}  // public activeModal: NgbActiveModal

  ngOnInit() {
    // this.modalService.open(this.content).result.then((result) => {
    //   //this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  closeModal(){
    //console.log(this.fiModal);
    console.log(this.activeModal);
    //this.activeModal.dismiss('Cross click');
    //this.fiModal.dismiss('Cross click');
    this.activeModal.dismiss('Cross Click');
    //modal.dismiss('Cross click')
  }

}

