import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestComponentComponent } from './components/test-component/test-component.component';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCpSFeQHtF4O6lTWP4HF9-o-ZlPcLNuQL0'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
