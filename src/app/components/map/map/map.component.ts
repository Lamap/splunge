import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import {
    LatLngBoundsLiteral, MapTypeStyle, ZoomControlOptions
} from '../../../../../node_modules/@agm/core/services/google-maps-types';

import * as mapConfig from './mapConfig.json';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { MarkerCrudService } from '../../../services/marker-crud.service';
import { AuthService } from '../../../services/auth.service';
import { ImageCrudService } from '../../../services/image-crud.service';

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

export class MapComponent implements OnInit, OnChanges {
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
    public mapTransitionDuration = 1000;
    public isGoogleMapOnTop = false;

    public markerCreateMode: boolean;
    public selectedMarkerPoint: ISpgMarker;
    public draggableCursor: string;

    public markersOnTheMap: string[] = [];

    private _nativeMap: any;
    private _defaultMapOptions: IMapOptions;
    private mapStyles = null; // (<any>mapConfig).styles as MapTypeStyle[];

    private currentMarkers: ISpgMarker[] = [];
    private topZindex: number;
    @Output() markerSelectionChanged$ = new EventEmitter<ISpgMarker | null>();
    @Output() loadImagesOfMarker$ = new EventEmitter<ISpgMarker>();
    @Input() mapOptions: IMapOptions;
    @Input() mapOverlayItems: IMapOverlayItem[];
    @Input() pointedMarker: ISpgMarker;

    constructor(private markerService: MarkerCrudService, authService: AuthService,
                private imageService: ImageCrudService) {
        this.markers$ = markerService.markers$;
        authService.user$.subscribe(user => {
            if (user) {
                this.isAdminMode = true;
            } else {
                this.isAdminMode = false;
            }
        });
        this.markers$.subscribe(markers => {
            this.currentMarkers = markers;
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges && simpleChanges.pointedMarker && simpleChanges.pointedMarker.currentValue) {
            // TODO: then remove the markerObject from the image, keep only the id
            const pointed: ISpgMarker = this.currentMarkers.filter(marker => {
              return marker.id === simpleChanges.pointedMarker.currentValue.id;
            }).pop();

            this.panToSelectedMarker(pointed);
        }
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
        this._nativeMap.fitBounds($event.bounds);
    }

    onBoundsChange($event) {
        this.mapOptions.fitBounds = null;
    }

    onZoomChange($event) {
        console.log('zoom', $event);

        setTimeout(() => {
            this.collectVisibleMarkers();
            }, 500);
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
        const zoom = this._nativeMap.getZoom();
        if (zoom === this.mapOptions.maxZoom) {
            return;
        }
        this._nativeMap.setZoom(zoom + 1)
        this.mapOptions.zoom = zoom + 1;
    }
    zoomOut($event) {
        const zoom = this._nativeMap.getZoom();
        if (zoom === 0) {
            return;
        }
        this.mapOptions.zoom = zoom - 1;
        this._nativeMap.setZoom(zoom - 1);
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
            this.markerSelectionChanged$.emit(this.selectedMarkerPoint);
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
        this.selectedMarkerId = $selectedPoint.id;
        this.selectedMarkerPoint = $selectedPoint;
        this.markerCreateMode = false;
        this.markerSelectionChanged$.emit(this.selectedMarkerPoint);

        if (!this.isAdminMode) {
            this.loadImagesOfMarker(this.selectedMarkerPoint);
        }
    }

    quitMarkerSelection() {
        this.selectedMarkerPoint = null;
        this.selectedMarkerId = null;
        this.markerSelectionChanged$.emit(null);
    }

    panToSelectedMarker($selectedPoint) {
        this.mapOptions.longitude = $selectedPoint.coords.longitude;
        this.mapOptions.latitude = $selectedPoint.coords.latitude;
        this._nativeMap.panTo({
            lat: this.mapOptions.latitude,
            lng: this.mapOptions.longitude
        });
        this._nativeMap.setZoom(20);
    }

    loadImagesOfMarker($marker) {
        const query = this.imageService.query$.getValue() || {};
        query.markerId = $marker.id;
        this.imageService.query$.next(query);
    }

    nativeMapReceived(map) {
        this._nativeMap = map;
    }
    collectVisibleMarkers() {
        const regexp = /data-spg-id="(.*?)"/mg;
        this.markersOnTheMap = [];
        if (
            this._nativeMap &&
            this._nativeMap.__gm &&
            this._nativeMap.__gm.panes &&
            this._nativeMap.__gm.panes.markerLayer &&
            this._nativeMap.__gm.panes.markerLayer.children &&
            this._nativeMap.__gm.panes.markerLayer.children.length
        ) {
            const markerNodes = this._nativeMap.__gm.panes.markerLayer.children;
            for (let index = 1; index < markerNodes.length; index++) {
                const markerElement = markerNodes[index];
                if (
                    markerElement.children &&
                    markerElement.children[0] &&
                    markerElement.children[0].src
                ) {
                    const result = regexp.exec(markerElement.children[0].src);
                    if (result && result[1]) {
                        this.markersOnTheMap.push(result[1]);
                    }
                    regexp.lastIndex = 0;
                }
            }
        }
        console.log('markers on the map:', this.markersOnTheMap);
    }
}
