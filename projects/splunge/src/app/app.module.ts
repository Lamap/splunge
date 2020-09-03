import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { HeaderWidget } from './widgets/header/header.widget';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { OverlayModule } from '@angular/cdk/overlay';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthService } from './services/auth.service';
import { FlashMessageComponent } from './components/flash-message/flash-message.component';
import { MapWidget } from './widgets/map/map.widget';
import { OsmMapWidget } from './widgets/osm-map/osm-map.widget';
import { MarkerComponent } from './components/marker/marker.component';
import { MarkerDirectionComponent } from './components/marker-direction/marker-direction.component';
import { ClusterpointComponent } from './components/clusterpoint/clusterpoint.component';
import { PositionMarkerComponent } from './components/position-marker/position-marker.component';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { MarkerEditorComponent } from './components/marker-editor/marker-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    LoginPage,
    HeaderWidget,
    FlashMessageComponent,
    MapWidget,
    OsmMapWidget,
    MarkerComponent,
    MarkerDirectionComponent,
    ClusterpointComponent,
    PositionMarkerComponent,
    DashboardPage,
    MarkerEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    MatSnackBarModule
  ],
  providers: [ AuthService ],
  bootstrap: [ AppComponent ],
  entryComponents: [ FlashMessageComponent ]
})
export class AppModule { }
