import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAboutComponent} from '../../fi-modal-test/modal-about.component';
import {FiBaseComp} from '../../fibasecomp/FiBaseComp';
import {AboutComponent} from '../../fi-modal-test/about.component';

@Component({
  selector: 'app-fimodal-test',
  templateUrl: './fi-modal-test.component.html',
  styleUrls: ['./fi-modal-test.component.scss'],
})
export class FiModalTestComponent extends FiBaseComp implements OnInit {

  constructor(public modalService: NgbModal) {
    super();
  }

  toggleFlag1: boolean;
  closeResult: string;

  ngOnInit() {
  }

  open2(content) { //, {ariaLabelledBy: 'modal-basic-title'}
    this.modalService.open(content, {}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeModal() {
    // console.log(this.activeModal);
    // this.activeModal.dismiss('ss');
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  open() {
    console.log('open event');
    // const modalRef = this.modalService.open(ModalComponent);
    const modalRef = this.modalService.open(ModalAboutComponent);
    modalRef.componentInstance.title = 'App Modal Title';
  }

  //ariaLabelledBy: 'modal-basic-title'
  openModalTemplate(content) {
    this.modalService.open(content, {}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalDynamic() {
    const modalRef = this.modalService.open(ModalAboutComponent);
    modalRef.componentInstance.title = 'App Modal Title';
    //modalRef.componentInstance.fiModal = modalRef;

    // iç compenent'e ulaşmak için
    let modalAbout = modalRef.componentInstance.refModal as AboutComponent;

  }

  // const modalRef = this.modalService.open(NgbdModalContent);
  //   modalRef.componentInstance.name = 'World';

  onToggle1() {
    this.toggleFlag1 = (this.toggleFlag1 === true) ? false : true;
  }


}
