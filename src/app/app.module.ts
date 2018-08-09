import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { MapComponent } from './components/map/map/map.component';
import { MapControlComponent } from './components/map/map-control/map-control.component';
import { MapOverlayComponent } from './components/map/map-overlay/map-overlay.component';
import { MatCardModule, MatSliderModule } from '@angular/material';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapControlComponent,
    MapOverlayComponent
  ],
  imports: [
    FormsModule,
      AgmOverlays,
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCpSFeQHtF4O6lTWP4HF9-o-ZlPcLNuQL0'
    }),
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
