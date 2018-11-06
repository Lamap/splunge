import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {
    LatLngBoundsLiteral, MapTypeStyle, ZoomControlOptions
} from '../../../../../node_modules/@agm/core/services/google-maps-types';

import * as mapConfig from './mapConfig.json';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MarkerCrudService } from '../../../services/marker-crud.service';
import { AuthService } from '../../../services/auth.service';
import { ImageCrudService } from '../../../services/image-crud.service';
import { spgConfig } from '../../../config';

declare var google: any; // TODO: get proper typing

export interface IMapOptions {
    longitude?: number;
    latitude?: number;
    zoom?: number;
    styles?: MapTypeStyle[];
    fitBounds?: LatLngBoundsLiteral;
    zoomControlOptions?: ZoomControlOptions;
    maxZoom?: number;
    minZoom?: number;
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
    maxZoom: number;
    isDisplayed?: boolean;
    opacity?: number;
    zIndex?: number;
    dated: IDateRange | number;
    top?: boolean;
    underTop?: boolean;
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

export class MapComponent implements OnInit {
    public markers$: Observable<ISpgMarker[]>;

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
    public mapTransitionDuration = spgConfig.mapTransitionDuration;
    public pointedMarker: ISpgMarker;

    public markerCreateMode: boolean;
    public selectedMarkerPoint: ISpgMarker;
    public draggableCursor: string;

    public markersOnTheMap: string[] = [];
    public mapOptions: IMapOptions = {
        longitude: spgConfig.defaultCenter.lng,
        latitude: spgConfig.defaultCenter.lat,
        zoom: spgConfig.defaultZoom,
        maxZoom: spgConfig.maxZoom,
        minZoom: spgConfig.minZoom,
        styles: (<any>mapConfig).styles as MapTypeStyle[]
    };
    public mapOverlayItems: IMapOverlayItem[];
    public comparedOverlays: IMapOverlayItem[] = [null, null];
    public maxVisibleMapoverlays = 2;

    private _nativeMap: any;
    private currentMarkers: ISpgMarker[] = [];
    private topZindex: number;

    @Output() markerSelectionChanged$ = new EventEmitter<ISpgMarker | null>();
    @Input() pointedMarkerId$: Subject<string | null>;

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

        this.topZindex = spgConfig.mapOverlays.length;
        this.mapOverlayItems = this.getProcessedOverlays(spgConfig.mapOverlays);
        this.comparedOverlays = this.getComparedMapOverlays(this.mapOverlayItems);
        this.imageService.query$.subscribe((query) => {
            if (!query.markerId) {
                this.quitMarkerSelection();
                this.pointedMarker = null;
            }
        });
    }

    ngOnInit() {
        this.pointedMarkerId$.subscribe(id => {
            this.pointedMarker = this.currentMarkers.find(marker => {
                return marker.id === id;
            });

            if (this.pointedMarker) {
                this.pointedMarker = JSON.parse(JSON.stringify(this.pointedMarker));
                this.panToSelectedMarker(this.pointedMarker);
            }
        });
    }

    getProcessedOverlays(overlays: IMapOverlayItem[]): IMapOverlayItem[] {
        return overlays.map(overlay => {
           if (overlay.id === spgConfig.topOverlay) {
               overlay.isDisplayed = true;
               overlay.top = true;
           }
           overlay.opacity = 100;
           return overlay;
        });
    }

    getComparedMapOverlays(overlays: IMapOverlayItem[]) {
        const compared = overlays.filter(overlay => overlay.isDisplayed);
        compared.length = this.maxVisibleMapoverlays;
        return compared.fill(null, compared.length);
    }

    onOverlayControlItemSelected($overlay: IMapOverlayItem) {
        this.topZindex++;

        $overlay.isDisplayed = true;
        $overlay.zIndex = this.topZindex;

        this.comparedOverlays.unshift($overlay);
        if (
            this.comparedOverlays.length > this.maxVisibleMapoverlays &&
            this.comparedOverlays[this.comparedOverlays.length - 1]
        ) {
            this.comparedOverlays[this.comparedOverlays.length - 1].isDisplayed = false;
        }
        this.comparedOverlays.splice(this.maxVisibleMapoverlays);

        this.mapOverlayItems.forEach(overlay => {
            overlay.top = false;
            overlay.underTop = false;
        });
        if (this.comparedOverlays[0]) {
            this.comparedOverlays[0].top = true;
        }
        if (this.comparedOverlays[1]) {
            this.comparedOverlays[1].underTop = true;
        }

        if ($overlay.maxZoom < this._nativeMap.getZoom()) {
            this.zoomTo($overlay.maxZoom);
        }

        console.log($overlay);
        const latCenter = $overlay.bounds.south + ($overlay.bounds.north - $overlay.bounds.south) / 2;
        const lngCenter = $overlay.bounds.west + ($overlay.bounds.east - $overlay.bounds.west) / 2;
        this._nativeMap.setCenter({lat: latCenter, lng: lngCenter});
        $overlay.opacity = 100;
    }

    removeOverlayFromCompare($overlay: IMapOverlayItem) {
        $overlay.isDisplayed = false;
        $overlay.top = false;
        $overlay.underTop = false;
        this.comparedOverlays = this.getComparedMapOverlays(this.mapOverlayItems);
    }

    swapComparedItems() {
        this.comparedOverlays.reverse();
        this.comparedOverlays[0].zIndex = this.topZindex;
        this.comparedOverlays[1].zIndex = this.topZindex - 1;
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
        const zoom = this._nativeMap.getZoom() + 1;
        if (
            zoom === this.mapOptions.maxZoom - 1 ||
            (this.comparedOverlays[0] && zoom >= this.comparedOverlays[0].maxZoom - 1)
        ) {
            return;
        }
        this._nativeMap.setZoom(zoom);
        this.mapOptions.zoom = zoom;
    }
    zoomOut($event) {
        const zoom = this._nativeMap.getZoom() - 1;
        if (zoom === -1) {
            return;
        }
        this.mapOptions.zoom = zoom;
        this._nativeMap.setZoom(zoom);
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
        this.selectedMarkerPoint = $selectedPoint;
        this.markerCreateMode = false;
        this.markerSelectionChanged$.emit(this.selectedMarkerPoint);

        this.pointedMarker = null;

        if (!this.isAdminMode) {
            this.loadImagesOfMarker(this.selectedMarkerPoint);
        }
    }

    quitMarkerSelection() {
        this.selectedMarkerPoint = null;
        this.markerSelectionChanged$.emit(null);
    }

    panToSelectedMarker($selectedPoint) {
        const reasonableZoomStep = 3;
        this.zoomTo(this._nativeMap.getZoom() - reasonableZoomStep).then(() => {
            this.panToPromise($selectedPoint.coords.latitude, $selectedPoint.coords.longitude).then(() => {
                this.zoomTo(this._nativeMap.getZoom() + reasonableZoomStep);
            });
        });
        this.quitMarkerSelection();
    }

    zoomTo(destZoom: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const zoomListener = this._nativeMap.addListener('idle', () => {
                zoomListener.remove();
                resolve();
            });
            this._nativeMap.setZoom(destZoom);
        });
    }
    panToPromise(lat: number, lng: number): Promise<void> {
        console.log(lat, lng);
        return new Promise((resolve, reject) => {
            const panToListener = this._nativeMap.addListener('idle', () => {
                panToListener.remove();
                resolve();
            });
            this.mapOptions.longitude = lng;
            this.mapOptions.latitude = lat;
            this._nativeMap.panTo({
                lat: this.mapOptions.latitude,
                lng: this.mapOptions.longitude
            });
        });
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

    moveMap($direction) {
        let centerLat = this._nativeMap.getCenter().lat();
        let centerLng = this._nativeMap.getCenter().lng();
        const horizontalStep = (this._nativeMap.getBounds().getNorthEast().lng() - this._nativeMap.getBounds().getSouthWest().lng()) / 3;
        const verticalStep = (this._nativeMap.getBounds().getNorthEast().lat() - this._nativeMap.getBounds().getSouthWest().lat()) / 3;

        if ($direction === 'LEFT' && centerLng - horizontalStep > spgConfig.moveBoundaries.west) {
            centerLng -= horizontalStep;
        }
        if ($direction === 'DOWN' && centerLat - verticalStep > spgConfig.moveBoundaries.south) {
            centerLat  -= verticalStep;
        }
        if ($direction === 'RIGHT' && centerLng + horizontalStep < spgConfig.moveBoundaries.east) {
            centerLng += horizontalStep;
        }
        if ($direction === 'UP' && centerLat + verticalStep < spgConfig.moveBoundaries.north) {
            centerLat += verticalStep;
        }
        this._nativeMap.setCenter({lat: centerLat, lng: centerLng});
    }
}
