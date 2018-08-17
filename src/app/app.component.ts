import { Component, Input, Output, EventEmitter } from '@angular/core';
import {IMapOptions, IMapOverlayItem} from './components/map/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public agmMapOptions: IMapOptions = {
    longitude: 19.04,
    latitude: 47.49,
    zoom: 16,
  };
  // TODO: convert to JSON or load from db and within map compoent
  public mapOverlayItems: IMapOverlayItem[] = [
    {
        id: 'T-2000',
        name: 'Ezredforduló',
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
        id: 'T-1930',
        name: 'Tabán 1930',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b2_22clr.gif',
        minZoom: 15,
        maxZoom: 20,
        isDisplayed: false,
        opacity: 100,
        dated: 1920,
        bounds: {
            north: 47.495809,
            south: 47.488865,
            east: 19.048340,
            west: 19.034961
        }
    },
    {
        id: 'T-1900',
        name: 'Tabán századforduló',
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
          id: 'TK-2000',
          name: 'Tabán és környéke ezredfordulón',
          src: 'http://tabanatlas.hspartacus.hu/trkp/K3_25clr.gif',
          minZoom: 15,
          maxZoom: 20,
          isDisplayed: true,
          isTop: true,
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
          id: 'TK-1930',
          name: 'Tabán és környéke a lebontás előtt',
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
          id: 'TK-1900',
          name: 'Tabán és környéke a századforduló előtt',
          src: 'http://tabanatlas.hspartacus.hu/trkp/K1_28clr.gif',
          minZoom: 15,
          maxZoom: 20,
          isDisplayed: false,
          opacity: 100,
          dated: 1880,
          bounds: {
              north: 47.497600,
              west: 19.024800,
              south: 47.483150,
              east: 19.0536900
          }
      },
      {
          id: 'TK-1840',
          name: 'Budapest a 19. század közepén',
          src: 'http://tabanatlas.hspartacus.hu/trkp/693151265311-2018-08-16T19_37_21.799135Z.png',
          minZoom: 8,
          maxZoom: 15,
          isDisplayed: false,
          opacity: 100,
          dated: 1830,
          bounds: {
              north: 47.549428,
              west: 18.993773,
              south: 47.476171,
              east: 19.092831
          }
      }
  ];

  constructor () {}
}
