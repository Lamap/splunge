import { Component, Input, Output, EventEmitter } from '@angular/core';
import {IMapOptions, IMapOverlayItem} from './components/map/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public agmMapOptions: IMapOptions = {
    longitude: 19.038091,
    latitude: 47.493741,
    zoom: 18,
  };
  // TODO: convert to JSON or load from db and within map compoent
  public mapOverlayItems: IMapOverlayItem[] = [
    {
        id: 'T-2000',
        name: 'Ezredforduló',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b3_22clr.gif',
        minZoom: 15,
        maxZoom: 20,
        isDisplayed: true,
        isTop: true,
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
          isDisplayed: false,
          opacity: 100,
          dated: 2000,
          bounds: {
              north: 47.495909,
              south: 47.488665,
              east: 19.048440,
              west: 19.034761
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
          dated: 2000,
          bounds: {
              north: 47.495909,
              south: 47.488665,
              east: 19.048440,
              west: 19.034761
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
          dated: 2000,
          bounds: {
              north: 47.495909,
              south: 47.488665,
              east: 19.048440,
              west: 19.034761
          }
      }
  ];

  constructor () {}
}
