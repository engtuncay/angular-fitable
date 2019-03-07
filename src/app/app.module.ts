import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Ng2TableModule } from './fi-comps/fi-table/fi-table-module';
import { TestCompComponent } from './fi-comps/test-comp/test-comp.component';

@NgModule({
  declarations: [
    AppComponent,
    TestCompComponent
  ],
  imports: [
    BrowserModule,
    Ng2TableModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent
  ]
})
export class AppModule { }
