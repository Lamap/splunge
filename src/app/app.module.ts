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
import { MatCardModule, MatSliderModule, MatCheckboxModule, MatDialogModule } from '@angular/material';
import 'hammerjs';
import { MarkerComponent } from './components/map/marker/marker.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MarkerEditorComponent } from './components/map/marker-editor/marker-editor.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SymbolFactoryService } from './services/symbol-factory.service';
import { MarkerCrudService } from './services/marker-crud.service';
import { AuthService } from './services/auth.service';
import { ImageCrudService} from './services/image-crud.service';
import { ImageControlComponent } from './components/imageGallery/image-control/image-control.component';
import { FileSelectorComponent } from './components/imageGallery/file-selector/file-selector.component';
import { AuthDialogComponent } from './components/common/auth-dialog/auth-dialog.component';
import { HeadImageComponent } from './components/imageGallery/head-image/head-image.component';
import { ImageListComponent } from './components/imageGallery/image-list/image-list.component';
import { ImageListItemComponent } from './components/imageGallery/image-list-item/image-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapControlComponent,
    MapOverlayComponent,
    MarkerComponent,
    MarkerEditorComponent,
    ImageControlComponent,
    FileSelectorComponent,
    AuthDialogComponent,
    HeadImageComponent,
    ImageListComponent,
    ImageListItemComponent
  ],
  entryComponents: [
      AuthDialogComponent
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
    MatCheckboxModule,
    MatDialogModule,
    AgmJsMarkerClustererModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [SymbolFactoryService, MarkerCrudService, ImageCrudService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
