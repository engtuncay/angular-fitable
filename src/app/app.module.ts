import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Ng2TableModule } from './components/table/ng-table-module';
import { TestCompComponent } from './components/test-comp/test-comp.component';


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
