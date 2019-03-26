import {Component} from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter, NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap';
import {CustomDatepickerI18n, I18n} from './I18n';
import {NgbDateTRParserFormatter} from './NgbDateTrParserFormatter';
import {NgbIsoTrDateAdapter} from './NgbIsoDateAdapter';
import {FormControl} from '@angular/forms';

// Js Date çevirmesi için
//{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}
@Component({
  selector: 'ngbd-datepicker-popup',
  templateUrl: './datepicker-popup.html',
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateParserFormatter,useClass: NgbDateTRParserFormatter},
    {provide: NgbDateAdapter, useClass: NgbIsoTrDateAdapter},
  ] // define custom NgbDatepickerI18n provider
})
export class NgbdDatepickerPopup {
  model;
  public formControl: FormControl = new FormControl(null);

  // keypressed($event: KeyboardEvent) {
  //
  //   console.log('Key',$event);
  //
  //
  //
  // }
  keypressed($event, d: NgbInputDatepicker) {
    d.toggle();

  }
}
