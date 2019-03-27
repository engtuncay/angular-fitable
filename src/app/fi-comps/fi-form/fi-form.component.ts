import {Component, Input, OnInit} from '@angular/core';
import {FiForm} from './fi-form';
import {FiColType, FiEditorType} from '../fi-table/FiTableEnums';

@Component({
  selector: 'app-fi-form',
  templateUrl: './fi-form.component.html',
  styleUrls: ['./fi-form.component.scss']
})
export class FiFormComponent implements OnInit {

  fiEditorType = FiEditorType;
  @Input() fiForm:FiForm = new FiForm();
  editorValue: any;
  fiColType = FiColType;

  constructor() { }

  ngOnInit() {
  }

  // onDateSelect($event: NgbDate, column: FiTableCol) {
  //
  // }

  // setColumnValue(value: any) {
  //
  // }
}
