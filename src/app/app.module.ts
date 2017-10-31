import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SplitModule } from './split';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SplitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
