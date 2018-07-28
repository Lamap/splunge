import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { MapTilerComponent } from './components/map-tiler/map-tiler.component';

@NgModule({
  declarations: [
    AppComponent,
    MapTilerComponent
  ],
  imports: [
    BrowserModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCpSFeQHtF4O6lTWP4HF9-o-ZlPcLNuQL0'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
