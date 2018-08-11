import { Component, Input, Output, EventEmitter } from '@angular/core';
import {IMapOptions, IMapOverlayItem} from './components/map/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public agmMapOptions: IMapOptions = {
    longitude: 19,
    latitude: 49,
    zoom: 10,
  };

  public mapOverlayItems: IMapOverlayItem[] = [
    {
        id: 'T-2000',
        name: 'Ezredforduló',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b3_22clr.gif',
        minZoom: 5,
        maxZoom: 12,
        isDisplayed: false,
        opacity: 100,
        dated: 2000,
        bounds: {
            north: 50,
            south: 48,
            east: 20,
            west: 17,
        }
    },
    {
        id: 'T-1930',
        name: 'Tabán 1930',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b2_22clr.gif',
        minZoom: 5,
        maxZoom: 12,
        isDisplayed: true,
        isTop: true,
        opacity: 100,
        dated: 1920,
        bounds: {
            north: 50,
            south: 48,
            east: 20,
            west: 17,
        }
    },
    {
        id: 'T-1900',
        name: 'Tabán századforduló',
        src: 'http://tabanatlas.hspartacus.hu/trkp/b1_22clr.gif',
        minZoom: 5,
        maxZoom: 12,
        isDisplayed: false,
        opacity: 100,
        dated: 1900,
        bounds: {
            north: 50,
            south: 48,
            east: 20,
            west: 17,
        }
    }
  ];

  constructor () {}
}
