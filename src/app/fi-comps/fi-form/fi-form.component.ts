import {Component, Input, OnInit} from '@angular/core';
import {FiForm} from './fi-form';
import {FiEditorType} from '../fi-table/FiTableEnums';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {FiTableCol} from '../fi-table/fi-table-col';

@Component({
  selector: 'app-fi-form',
  templateUrl: './fi-form.component.html',
  styleUrls: ['./fi-form.component.scss']
})
export class FiFormComponent implements OnInit {

  fiEditorType = FiEditorType;
  @Input() fiForm:FiForm = new FiForm();
  editorValue: any;

  constructor() { }

  ngOnInit() {
  }

  onDateSelect($event: NgbDate, column: FiTableCol) {

  }
}
