import { Component, OnInit, Input, AfterViewInit, OnChanges, Output, EventEmitter,
    ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ISpgMarker } from '../map/map.component';
import { GoogleMapsAPIWrapper } from '../../../../../node_modules/@agm/core/services/google-maps-api-wrapper';

declare var google: any; // TODO: get proper typing

@Component({
  selector: 'spg-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.less']
})
export class MarkerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('panorama', { read: ElementRef }) svgContent: ElementRef;
    @ViewChild('pointer', { read: ElementRef }) pointer: ElementRef;
    @ViewChild('markersymbol', { read: ElementRef }) markerSymbol: ElementRef;
    @ViewChild('markersymbolselected', { read: ElementRef }) markerSymbolSelected: ElementRef;

    @Input() markerPoint: ISpgMarker;
    @Input() isAdminMode: boolean;
    @Input() isSelected: boolean;
    @Input() isPointed: boolean;
    @Input() isClustered: boolean;

    @Output() $markerSelected = new EventEmitter<ISpgMarker>();
    @Output() $markerRepositioned = new EventEmitter<ISpgMarker>();

    public iconUrl;
    public pointerSize = 250;
    public panoramaSize = 300;
    public markerSize = 40;

    private width = 40;
    private height = 40;
    private panoramaOverlay: any;
    private pointerOverlay: any;
    private targetPane: any;
    private nativeMap;

    public zIndex = Math.round((Math.random() * 1000000));

    constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) {
        this._mapsWrapper.getNativeMap().then(gMap => {
            this.nativeMap = gMap;
            this.nativeMap.addListener('zoom_changed', () => {
                this.zoomChanged();
            });
        });
    }

    ngOnInit() {}
    ngAfterViewInit() {
        this.panoramaOverlay = this.svgContent.nativeElement.children[0];
        this.pointerOverlay = this.pointer.nativeElement.children[0];

        this._mapsWrapper.getNativeMap().then(gMap => {
            const overlayView = new google.maps.OverlayView();
            overlayView.setMap(gMap);
            overlayView.draw = () => {
                const projection = overlayView.getProjection();
                const latLngPoint = new google.maps.LatLng(this.markerPoint.coords.latitude, this.markerPoint.coords.longitude);
                const xyCoord = projection.fromLatLngToDivPixel(latLngPoint);
                this.panoramaOverlay.style.left = xyCoord.x + 'px';
                this.panoramaOverlay.style.top = xyCoord.y + 'px';

                this.pointerOverlay.style.left = xyCoord.x + 'px';
                this.pointerOverlay.style.top = xyCoord.y + 'px';
                this.pointerOverlay.style.display = this.isPointed ? 'block' : 'none';
            };
            overlayView.onAdd = () => {
                if (this.markerPoint.hasDirection) {
                    this.panoramaOverlay.style.transform = 'rotate(' + this.markerPoint.direction + 'deg)';
                    this.panoramaOverlay.style.transformOrigin = 'top left';

                    this.targetPane = overlayView.getPanes().mapPane;
                    this.targetPane.appendChild(this.panoramaOverlay);

                    this.targetPane.appendChild(this.pointerOverlay);
                }
            };
            overlayView.getDiv = () => {
                return this.panoramaOverlay;
            };
        });

        this.drawMarker();
    }

    ngOnDestroy() {
        console.log('destroy:', this.panoramaOverlay);
        if (this.targetPane && this.panoramaOverlay) {
            this.targetPane.removeChild(this.panoramaOverlay);
        }
    }

    ngOnChanges(simpleChange) {
        if (simpleChange && (simpleChange.isSelected || simpleChange.isPointed || simpleChange.isClustered)) {
            this.drawMarker();
        }
        if (simpleChange && simpleChange.isClustered && this.panoramaOverlay) {
            if (this.isClustered) {
                this.panoramaOverlay.style.display = 'none';
            } else {
                this.panoramaOverlay.style.display = 'block';
            }
        }
        if (this.pointerOverlay && simpleChange && (simpleChange.isClustered || simpleChange.isPointed )) {
            if (!this.isClustered && this.isPointed) {
                this.pointerOverlay.style.display = 'block';
            } else {
                this.pointerOverlay.style.display = 'none';
            }
        }
    }

    zoomChanged() {
        console.log('zoomChanged');
    }

    public markerClicked() {
        this.$markerSelected.emit(this.markerPoint);

    }

    public markerDropped($event) {
        this.markerPoint.coords.longitude = $event.coords.lng;
        this.markerPoint.coords.latitude = $event.coords.lat;
        this.$markerRepositioned.emit(this.markerPoint);
    }

    private drawMarker() {
        let url = 'data:image/svg+xml;utf-8, \n';
        url += this.isSelected ?
            this.markerSymbolSelected.nativeElement.firstElementChild.outerHTML :
            this.markerSymbol.nativeElement.firstElementChild.outerHTML;

        this.iconUrl = {
            url: url,
            scale: 1,
            anchor: new google.maps.Point(this.width / 2, this.height / 2)
        };
    }
}
