import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IMapOptions, IMapOverlayItem, ISpgMarker } from './components/map/map/map.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthDialogComponent, IUserAuthData } from './components/common/auth-dialog/auth-dialog.component';
import { ImageData } from './services/image-crud.service';
import { spgConfig } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public isAdminMode: boolean;
  public user$: Observable<firebase.User>;
  public isFullscreen = false;

  public agmMapOptions: IMapOptions = {
    longitude: spgConfig.defaultCenter.lng,
    latitude: spgConfig.defaultCenter.lat,
    zoom: spgConfig.defaultZoom,
  };
  public mapOverlayItems: IMapOverlayItem[];
  public userAuthData: IUserAuthData;
  public userEmail = '';
  public selectedMarker: ISpgMarker;
  public pointedMarkerId$ = new Subject<string | null>();

  public screensaving = false;

  private authDialogRef: MatDialogRef<AuthDialogComponent, IUserAuthData>;

  private screensaverTimeout = 2 * 60 * 1000;
  private sreensaverSession: number;

  constructor (private authService: AuthService, private dialog: MatDialog) {
      this.userAuthData = {
          email: null,
          password: null
      };
      this.user$ = this.authService.user$;
      this.authService.user$.subscribe(user => {
         this.userEmail = user ? user.email : '';
      });

      this.mapOverlayItems = spgConfig.mapOverlays;
      this.startScreensaver();
  }
  logIn() {
      this.authDialogRef = this.dialog.open(AuthDialogComponent, {
          data: this.userAuthData
      });
      this.authDialogRef.afterClosed().subscribe(result => {
          this.authService.logIn(this.userAuthData.email, this.userAuthData.password);
      });
  }
  logOut() {
      this.authService.logOut();
  }
  markerSelectionChanged(marker: ISpgMarker | null) {
      this.selectedMarker = marker;
  }
  pointImageMarker($image: ImageData) {
    this.pointedMarkerId$.next($image.markerId);
  }
  toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      if (this.isFullscreen) {
          this.enterFullscreen();
      } else {
          this.exitFullscreen();
      }
  }
  enterFullscreen() {
      const elem: any = document.body;
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
      }
  }
  exitFullscreen() {
      const target: any = document;
      if (target.cancelFullScreen) {
          target.cancelFullScreen();
      } else if (target.mozCancelFullScreen) {
          target.mozCancelFullScreen();
      } else if (target.webkitCancelFullScreen) {
          target.webkitCancelFullScreen();
      }
  }

  startScreensaver() {
      this.screensaving = false;
      if (this.sreensaverSession) {
          clearTimeout(this.sreensaverSession);
      }
      this.sreensaverSession = setTimeout(() => {
          this.screensaving = true;
      }, this.screensaverTimeout);
  }
  restartScreensaveTimeout() {
      this.startScreensaver();
  }
}
