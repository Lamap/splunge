import { Component, Input, Output, EventEmitter } from '@angular/core';
import {IMapOptions, IMapOverlayItem} from './components/map/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public agmMapOptions: IMapOptions = {
    longitude: 5,
    latitude: 48,
    zoom: 7,
  };

  public mapOverlayItems: IMapOverlayItem[] = [
    {
        id: 'belaterkepe',
        name: 'Béla térképe',
        north: 50,
        south: 40,
        east: 18,
        west: 10,
        minZoom: 5,
        maxZoom: 12,
        isDisplayed: false,
        opacity: 0.6,
        src: 'http://tabanatlas.hspartacus.hu/trkp/b2_22clr.gif'
    },
    {
        id: 'jenoterkepe',
        name: 'Jenő térképe',
        north: 50,
        south: 40,
        east: 9,
        west: 7,
        minZoom: 5,
        maxZoom: 12,
        isDisplayed: true,
        opacity: 0.5,
        src: 'http://tabanatlas.hspartacus.hu/trkp/b1_22clr.gif'
    }
  ];

  constructor () {}
}
