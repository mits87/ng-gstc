import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgGstcModule } from 'ng-gstc';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgGstcModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
