import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { MapComponent } from './components/map/map/map.component';
import { MapControlComponent } from './components/map/map-control/map-control.component';
import { MapOverlayComponent } from './components/map/map-overlay/map-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapControlComponent,
    MapOverlayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCpSFeQHtF4O6lTWP4HF9-o-ZlPcLNuQL0'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
