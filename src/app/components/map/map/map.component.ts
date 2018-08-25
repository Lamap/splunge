import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {
    LatLngBoundsLiteral, MapTypeStyle, ZoomControlOptions
} from '../../../../../node_modules/@agm/core/services/google-maps-types';
import * as mapConfig from './mapConfig.json';

declare var google: any; // TODO: get proper typing

export interface IMapOptions {
    longitude?: number;
    latitude?: number;
    zoom?: number;
    styles?: MapTypeStyle[];
    fitBounds?: LatLngBoundsLiteral;
    zoomControlOptions?: ZoomControlOptions;
    maxZoom?: number;
}
export interface IDateRange {
    from: number;
    to: number;
}
export interface IMapOverlayItem {
    id: string;
    name: string; // TODO: translatable
    bounds?: LatLngBoundsLiteral;
    src?: string;
    minZoom: number;
    maxZoom: number;
    defaultCenterPosition?: any; // TODO: make it to lngLat
    isDisplayed: boolean;
    opacity?: number;
    zIndex?: number;
    dated: IDateRange | number;
    isTop?: boolean;
    isUnderTop?: boolean;
}

export interface ISpgPoint {
    latitude: number;
    longitude: number;
    direction?: number;
    hasDirection?: boolean;
    isActual?: boolean;
    id: string;
}

@Component({
    selector: 'spg-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less']
})
// TODO: get all the props, looks that agm doesnt have an interface???

export class MapComponent implements OnInit {
    private mapStyles = null;//(<any>mapConfig).styles as MapTypeStyle[];

    public clusterStyles = [
        {
            textColor: '#555',
            textSize: 25,
            url: './assets/images/clusterIcon.svg',
            width: 46,
            height: 46
        }
    ];

    public isGoogleMapOnTop = false;
    public points: ISpgPoint[] = [];

    public markerCreateMode: boolean;
    public selectedMarkerPoint: ISpgPoint;

    private _defaultMapOptions: IMapOptions
    private topZindex: number;

    @Input() mapOptions: IMapOptions;
    @Input() mapOverlayItems: IMapOverlayItem[];
    @Input() isAdminMode: boolean;

    constructor() {
    }

    ngOnInit() {

        this._defaultMapOptions = {
            longitude: 47.4852067018603,
            latitude: 19.04982070177425,
            zoom: 18,
            styles: this.mapStyles,
            maxZoom: 22
        };
        this.mapOptions = _.merge(this._defaultMapOptions, this.mapOptions);
        this.topZindex = this.mapOverlayItems.length;
        const displayedOverlay = this.mapOverlayItems.filter (overlay => overlay.isDisplayed ).pop();
        displayedOverlay.zIndex = this.topZindex;
    }

    onOverlayControlItemSelected($event: IMapOverlayItem) {
        const clickedId = $event.id;
        this.topZindex++;
        this.isGoogleMapOnTop = false;

        this.mapOverlayItems.map((overlay) => {
            if (overlay.id === clickedId) {
                overlay.isTop = true;
                overlay.zIndex = this.topZindex;
                overlay.isDisplayed = true;
                overlay.opacity = 100;
            }
            if (overlay.zIndex === this.topZindex - 1) {
                overlay.isUnderTop = true;
            }
            if (!overlay.zIndex || overlay.zIndex < this.topZindex) {
                overlay.isTop = false;
                overlay.opacity = 100;
            }
            if (!overlay.zIndex || overlay.zIndex < this.topZindex - 1) {
                overlay.isDisplayed = false;
                overlay.isUnderTop = false;
            }
        });
    }

    onGoogleMapsSelected($event: boolean) {
        this.isGoogleMapOnTop = true;
        this.mapOverlayItems.map((overlay) => {
           if (overlay.zIndex === this.topZindex) {
               overlay.isDisplayed = false;
               overlay.isTop = false;
           }
           if (overlay.zIndex === this.topZindex - 1)  {
               overlay.isDisplayed = false;
               overlay.opacity = 0;
           }
            overlay.isUnderTop = false;
        });
        this.topZindex++;
    }

    onFitTomMapBounds($event: IMapOverlayItem) {
         this.mapOptions.fitBounds = $event.bounds;
    }

    onBoundsChange($event) {
        console.log($event);
        this.mapOptions.fitBounds = null;
    }

    onZoomChange($event) {
        console.log('zoom', $event);
    }

    onCenterChange($event) {
        console.log('center', $event);
    }

    onMapClick($event) {
        console.log('mapClick', $event);

        if (!this.markerCreateMode) {
            return;
        }

        this.clearPrevSelectedPoint();

        this.selectedMarkerPoint = {
            longitude: $event.coords.lng,
            latitude: $event.coords.lat,
            isActual: true,
            direction: 90,
            id: Math.round(Math.random() * 10000000000).toString()
        };

        this.points.push(this.selectedMarkerPoint);
        this.markerCreateMode = false;
    }

    zoomIn($event) {
        if (this.mapOptions.zoom === this.mapOptions.maxZoom) {
            return;
        }
        this.mapOptions.zoom++;
    }
    zoomOut($event) {
        if (this.mapOptions.zoom === 0) {
            return;
        }
        this.mapOptions.zoom--;

    }

    markerCreateModeChanged($event) {
        this.markerCreateMode = $event;
    }

    markerDataUpdated($updatedPoint) {
        const index = this.points.map(point => point.id).indexOf($updatedPoint.id);
        this.points[index] = JSON.parse(JSON.stringify($updatedPoint));
    }

    markerSelected($updatedPoint) {
        const index = this.points.map(point => point.id).indexOf($updatedPoint.id);

        this.clearPrevSelectedPoint();

        $updatedPoint.isActual = true;
        this.selectedMarkerPoint = $updatedPoint;
        this.points[index] = JSON.parse(JSON.stringify($updatedPoint));
    }

    private clearPrevSelectedPoint() {
        if (!this.selectedMarkerPoint) {
            return;
        }
        const prevIndex = this.points.map(point => point.id).indexOf(this.selectedMarkerPoint.id);
        this.selectedMarkerPoint.isActual = false;
        this.points[prevIndex] = JSON.parse(JSON.stringify(this.selectedMarkerPoint));
    }
}
