import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Ng2TableModule } from './fi-comps/fi-table/fi-table-module';
import { TestCompComponent } from './fi-comps/test-comp/test-comp.component';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    TestCompComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    Ng2TableModule
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
