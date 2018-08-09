import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import _ from 'lodash';

export interface IMapOptions {
    longitude?: number;
    latitude?: number;
    zoom?: number;
}
export interface IDateRange {
    from: number;
    to: number;
}
export interface IMapOverlayItem {
    id: string;
    name: string; // TODO: translatable
    src?: string;
    north: number;
    south: number;
    west: number;
    east: number;
    minZoom: number;
    maxZoom: number;
    defaultCenterPosition?: any; // TODO: make it to lngLat
    isDisplayed: boolean;
    opacity?: number;
    zIndex?: number;
    dated: IDateRange | number;
    isTop?: boolean;
}
@Component({
    selector: 'spg-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less']
})
// TODO: get all the props, looks that agm doesnt have an interface???

export class MapComponent implements OnInit {

    public isGoogleMapOnTop = false;

    private _defaultMapOptions: IMapOptions = {
        longitude: 47,
        latitude: 19,
        zoom: 10,
    };
    private maxZindex: number;

    @Input() mapOptions: IMapOptions;
    @Input() mapOverlayItems: IMapOverlayItem[];

    constructor() {
    }

    ngOnInit() {
        this.mapOptions = _.merge(this._defaultMapOptions, this.mapOptions);
        console.log(this.mapOverlayItems);
        this.maxZindex = this.mapOverlayItems.length;
    }

    onOverlayControlItemSelected($event: IMapOverlayItem) {
        const clickedId = $event.id;
        this.maxZindex++;
        this.isGoogleMapOnTop = false;

        this.mapOverlayItems.map((overlay) => {
            if (overlay.id === clickedId) {
                overlay.isTop = true;
                overlay.zIndex = this.maxZindex;
                overlay.isDisplayed = true;
                overlay.opacity = 100;
            }
            if (!overlay.zIndex || overlay.zIndex < this.maxZindex) {
                overlay.isTop = false;
                overlay.opacity = 100;
            }
            if (!overlay.zIndex || overlay.zIndex < this.maxZindex - 1) {
                overlay.isTop = false;
                overlay.isDisplayed = false;
            }
        });
        console.log(this.maxZindex);
    }

    onGoogleMapsSelected($event: boolean) {
        console.log('gmapsSelected', $event);
        this.isGoogleMapOnTop = true;
        this.mapOverlayItems.map((overlay) => {
           if (overlay.zIndex === this.maxZindex) {
               overlay.isDisplayed = false;
               overlay.isTop = false;
           }
           if (overlay.zIndex === this.maxZindex - 1)  {
               overlay.isDisplayed = false;
               overlay.opacity = 0;
           }
        });
    }
}
