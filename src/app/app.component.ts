import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IMapOptions, IMapOverlayItem, ISpgMarker } from './components/map/map/map.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthDialogComponent, IUserAuthData } from './components/common/auth-dialog/auth-dialog.component';
import { ImageData } from './services/image-crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public isAdminMode: boolean;
  public user$: Observable<firebase.User>;

  public agmMapOptions: IMapOptions = {
    longitude: 19.045,
    latitude: 47.49258698962108,
    zoom: 18,
  };
  // TODO: convert to JSON or load from db and within map compoent
  public mapOverlayItems: IMapOverlayItem[] = [
    {
        id: 'T-2000',
        name: 'Tabán az ezredfordulón (L. Ákos)',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b3_22clr.gif',
        minZoom: 15,
        maxZoom: 20,
        isDisplayed: false,
        opacity: 100,
        dated: 2000,
        bounds: {
            north: 47.495809,
            south: 47.488865,
            east: 19.048340,
            west: 19.034961
        },
    },
      {
          id: 'TK-2000',
          name: 'Tabán és környéke ezredfordulón (L. Ákos)',
          src: 'http://tabanatlas.hspartacus.hu/trkp/K3_25clr.gif',
          minZoom: 15,
          maxZoom: 20,
          isDisplayed: false,
          opacity: 100,
          dated: 2000,
          bounds: {
              north: 47.497600,
              west: 19.024800,
              south: 47.483150,
              east: 19.0536900
          }
      },
      {
          id: 'TK-1944',
          name: 'Légifotó a 2. világháború végéről',
          src: 'http://tabanatlas.hspartacus.hu/trkp/Aerial_1944_cropped_W1800.jpg',
          minZoom: 10,
          maxZoom: 20,
          opacity: 100,
          dated: 1944,
          bounds: {
              north: 47.499400,
              west: 19.032295,
              south: 47.4879400,
              east: 19.047728
          },
          isDisplayed: false
      },
      {
        id: 'T-1930',
        name: 'A lebontás előtti Tabán (L. Ákos)',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b2_22clr.gif',
        minZoom: 15,
        maxZoom: 20,
        isDisplayed: false,
        opacity: 100,
        dated: 1930,
        bounds: {
            north: 47.495809,
            south: 47.488865,
            east: 19.048340,
            west: 19.034961
        }
    },
      {
          id: 'TK-1930',
          name: 'Tabán és környéke a lebontás előtt (L. Ákos)',
          src: 'http://tabanatlas.hspartacus.hu/trkp/K2_25clr.gif',
          minZoom: 15,
          maxZoom: 20,
          isDisplayed: false,
          opacity: 100,
          dated: 1930,
          bounds: {
              north: 47.497600,
              west: 19.024800,
              south: 47.483150,
              east: 19.0536900
          }
      },
      {
        id: 'T-1900',
        name: 'A Tabán a századfordulón (L. Ákos)',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b1_22clr.gif',
        minZoom: 15,
        maxZoom: 20,
        isDisplayed: false,
        opacity: 100,
        dated: 1900,
        bounds: {
            north: 47.495809,
            south: 47.488865,
            east: 19.048340,
            west: 19.034961
        }
    },
      {
          id: 'TK-1900',
          name: 'Tabán és környéke a századfordulón (L. Ákos)',
          src: 'http://tabanatlas.hspartacus.hu/trkp/K1_28clr.gif',
          minZoom: 15,
          maxZoom: 20,
          isDisplayed: false,
          opacity: 100,
          dated: 1900,
          bounds: {
              north: 47.497600,
              west: 19.024800,
              south: 47.483150,
              east: 19.0536900
          }
      },
      {
          id: 'Marek-1874',
          name: 'Marek féle budai felmérés',
          src: 'http://tabanatlas.hspartacus.hu/trkp/1874_marek_v2.jpg',
          minZoom: 10,
          maxZoom: 22,
          opacity: 100,
          isDisplayed: false,
          isTop: false,
          dated: 1874,
          bounds: {
              north: 47.500400,
              west: 19.022782,
              south: 47.486973803423446,
              east: 19.047611525575803
          }
      },
      {
          id: 'Buda-1824',
          name: 'Buda a 19. század első felében',
          src: 'http://tabanatlas.hspartacus.hu/trkp/1824_buda.png',
          minZoom: 10,
          maxZoom: 20,
          opacity: 100,
          dated: 1824,
          bounds: {
              north: 47.505324,
              west: 19.020713,
              south: 47.484108,
              east: 19.049125
          },
          isDisplayed: false
      },
      {
          id: 'TK-1760',
          name: 'Budapest a 18. század közepén',
          src: 'http://tabanatlas.hspartacus.hu/trkp/btm_1760.png',
          minZoom: 8,
          maxZoom: 15,
          isDisplayed: false,
          opacity: 100,
          dated: 1830,
          bounds: {
              north: 47.545427,
              west: 19.002246,
              south: 47.478336,
              east: 19.085228
          }
      }
  ];
  public userAuthData: IUserAuthData;
  public userEmail = '';
  public selectedMarker: ISpgMarker;
  public pointedMarker: ISpgMarker;

  private authDialogRef: MatDialogRef<AuthDialogComponent, IUserAuthData>;

  constructor (private authService: AuthService, private dialog: MatDialog) {
      this.userAuthData = {
          email: null,
          password: null
      };
      this.user$ = this.authService.user$;
      this.authService.user$.subscribe(user => {
         this.userEmail = user ? user.email : '';
      });
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
    console.log('point:', $image);
    this.pointedMarker = JSON.parse(JSON.stringify($image.marker));
  }
}
