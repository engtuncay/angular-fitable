import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Ng2TableModule } from './fi-comps/fi-table/fi-table-module';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FiModalTestComponent} from './fi-comps/test-comps/fi-modal-test/fi-modal-test.component';
import {FiTableTestComponent} from './fi-comps/test-comps/fi-table-test/fi-table-test.component';


@NgModule({
  declarations: [
    AppComponent,
    FiModalTestComponent,
    FiTableTestComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    Ng2TableModule,
    RouterModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent
  ]
})
export class AppModule { }
