import {Component, Input, OnInit} from '@angular/core';
import {FiColType, FiEditorType} from '../fi-table/FiTableEnums';
import {FiForm} from '../fi-form/fi-form';

@Component({
  selector: 'fi-form-rapor',
  templateUrl: './fi-form-rapor.component.html',
  styleUrls: ['./fi-form-rapor.component.scss']
})
export class FiFormRaporComponent implements OnInit {

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
