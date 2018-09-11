import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {
    LatLngBoundsLiteral, MapTypeStyle, ZoomControlOptions
} from '../../../../../node_modules/@agm/core/services/google-maps-types';
import * as mapConfig from './mapConfig.json';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { MarkerCrudService } from '../../../services/marker-crud.service';
import { AuthService } from '../../../services/auth.service';

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

export interface ISpgCoords {
    latitude: number;
    longitude: number;
}

export interface ISpgMarker {
    id?: string;
    coords: ISpgCoords;
    hasDirection?: boolean;
    direction?: number;
    isActual?: boolean;
}

@Component({
    selector: 'spg-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less']
})
// TODO: get all the props, looks that agm doesnt have an interface???

export class MapComponent implements OnInit {
    public markerFbsCollection: AngularFirestoreCollection<ISpgMarker>;
    public markers$: Observable<ISpgMarker[]>;
    public selectedMarkerId: string;

    public clusterStyles = [
        {
            textColor: '#555',
            textSize: 25,
            url: './assets/images/clusterIcon.svg',
            width: 46,
            height: 46
        }
    ];

    public isAdminMode: boolean;
    public isGoogleMapOnTop = false;

    public markerCreateMode: boolean;
    public selectedMarkerPoint: ISpgMarker;
    public draggableCursor: string;

    private _defaultMapOptions: IMapOptions;
    private mapStyles = null; // (<any>mapConfig).styles as MapTypeStyle[];

    private topZindex: number;
    @Input() mapOptions: IMapOptions;
    @Input() mapOverlayItems: IMapOverlayItem[];

    constructor(store: AngularFirestore, private markerService: MarkerCrudService, authService: AuthService) {
        this.markerFbsCollection = store.collection('markers');
        this.markers$ = markerService.markers$;
        authService.user$.subscribe(user => {
            if (user) {
                this.isAdminMode = true;
            } else {
                this.isAdminMode = false;
            }
        });
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
        this.mapOptions.fitBounds = null;
    }

    onZoomChange($event) {
        console.log('zoom', $event);
    }

    onCenterChange($event) {
        console.log('center', $event);
    }

    onMapClick($event) {
        if (this.markerCreateMode) {
            this.addMarker({
                // TODO: use google coords format everywhere
                latitude: $event.coords.lat,
                longitude: $event.coords.lng
            });
        }
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
        this.draggableCursor = $event ? 'crosshair' : 'move';

        this.quitMarkerSelection();
    }

    addMarker(coords: ISpgCoords) {
        this.quitMarkerSelection();
        this.markerCreateMode = false;
        this.draggableCursor = 'move';

        this.markerService.addMarker(coords).then(newMarker => {
            this.selectedMarkerPoint = newMarker;
            this.selectedMarkerId = newMarker.id;
        });
    }

    updateMarker($updatedPoint) {
        this.markerService.updateMarker($updatedPoint);
    }

    deleteMarker($deletedPoint) {
        this.markerService.deleteMarker($deletedPoint).then(() => {
            this.selectedMarkerPoint = null;
        });
    }

    selectMarker($selectedPoint) {
        console.log($selectedPoint);
        this.selectedMarkerId = $selectedPoint.id;
        this.selectedMarkerPoint = $selectedPoint;
        this.markerCreateMode = false;
    }

    quitMarkerSelection() {
        this.selectedMarkerPoint = null;
        this.selectedMarkerId = null;
    }

    panToSelectedMarker($selectedPoint) {
        this.mapOptions.longitude = $selectedPoint.coords.longitude;
        this.mapOptions.latitude = $selectedPoint.coords.latitude;
        this.mapOptions = JSON.parse(JSON.stringify(this.mapOptions));
    }
}
