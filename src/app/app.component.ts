import { Component, Input, Output, EventEmitter } from '@angular/core';
import {IMapOptions, IMapOverlayItem} from './components/map/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public lat =  47;
  public lng = 19;
  public mapOverlayOpacity = 50;

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
        displayed: false
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
        displayed: true
    }
  ];

  constructor () {}
}
