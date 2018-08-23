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
import { MarkerComponent } from './components/map/marker/marker.component';
import { SymbolFactoryService } from './services/symbol-factory.service';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapControlComponent,
    MapOverlayComponent,
    MarkerComponent
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
    MatSliderModule,
    AgmJsMarkerClustererModule
  ],
  providers: [SymbolFactoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
