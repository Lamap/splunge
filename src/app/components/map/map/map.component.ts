import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import _ from 'lodash';

export interface IMapOptions {
    longitude?: number;
    latitude?: number;
    zoom?: number;
}
export interface IMapOverlayItem {
  name: string; // TODO: translatable
  north: number;
  south: number;
  west: number;
  east: number;
  minZoom: number;
  maxZoom: number;
  defaultCenterPosition?: any; // TODO: make it to lngLat
}
@Component({
  selector: 'spg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
// TODO: get all the props, looks that agm doesnt have an interface???

export class MapComponent implements OnInit {

  public dummyMapOverlay: IMapOverlayItem;

  private _defaultMapOptions: IMapOptions = {
    longitude: 47,
    latitude: 19,
    zoom: 10,
  };

  @Input() mapOptions: IMapOptions;
  @Input() mapOverlayItems: IMapOverlayItem[];

  constructor() {
  }

  ngOnInit() {
    this.mapOptions = _.merge(this._defaultMapOptions, this.mapOptions);
    console.log(this.mapOverlayItems);
    this.dummyMapOverlay = this.mapOverlayItems[0];
  }

}
