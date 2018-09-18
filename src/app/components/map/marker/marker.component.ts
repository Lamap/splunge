import { Component, OnInit, Input, AfterViewInit, OnChanges, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ISpgMarker } from '../map/map.component';
import { SymbolFactoryService } from '../../../services/symbol-factory.service';
import { GoogleMapsAPIWrapper } from '../../../../../node_modules/@agm/core/services/google-maps-api-wrapper';

// import { google } from '../../../../../node_modules/@agm/core/services/google-maps-types';
declare var google: any; // TODO: get proper typing

@Component({
  selector: 'spg-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.less']
})
export class MarkerComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('svgContent', { read: ElementRef }) template: ElementRef;
    @ViewChild('agmMarker', { read: ElementRef }) agmMarker: ElementRef;

    @Input() markerPoint: ISpgMarker;
    @Input() isAdminMode: boolean;
    @Input() isSelected: boolean;
    @Input() isPointed: boolean;

    @Output() $markerSelected = new EventEmitter<ISpgMarker>();
    @Output() $markerRepositioned = new EventEmitter<ISpgMarker>();

    public iconUrl;

    private width = 40;
    private height = 40;
    private overlayElement: any;

    constructor(protected _mapsWrapper: GoogleMapsAPIWrapper, private markerGenerator: SymbolFactoryService) {
    }

    ngOnInit() {}
    ngAfterViewInit() {
        this.overlayElement = this.template.nativeElement.children[0];
/*
this.template.nativeElement. on('click', event => {
   console.log('magasságos jenőbizgeráció');
});

console.log(':::', this.template.nativeElement.querySelector('svg'));
this.template.nativeElement.querySelector('svg')
    .addEventListener('click', event => {
        console.log('clicked', event);
    });

console.log('markerItself', this.agmMarker.nativeElement.isDisplayed);
*/
/*
        this._mapsWrapper.getNativeMap().then(gMap => {
            this.drawMarker();

            const overlayView = new google.maps.OverlayView();
            overlayView.setMap(gMap);
            overlayView.draw = () => {
                const projection = overlayView.getProjection();
                const latLngPoint = new google.maps.LatLng(this.markerPoint.coords.latitude, this.markerPoint.coords.longitude);
                const xyCoord = projection.fromLatLngToDivPixel(latLngPoint);
                this.overlayElement.style.left = xyCoord.x + 'px';
                this.overlayElement.style.top = xyCoord.y + 'px';
            };
            overlayView.onAdd = () => {
                const targetPane = overlayView.getPanes().mapPane;
                targetPane.appendChild(this.overlayElement);
            };
            overlayView.getDiv = () => {
                return this.overlayElement;
            };
        });
        */
    }

    ngOnChanges(simpleChange) {
        if (simpleChange && (simpleChange.isSelected || simpleChange.isPointed)) {
            this.drawMarker();
        }
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
        this.iconUrl = {
            url: this.markerGenerator.generate(
                this.markerPoint.direction,
                this.width, this.height,
                this.markerPoint.hasDirection,
                this.isSelected,
                this.isPointed),
            scale: 1,
            anchor: new google.maps.Point(this.width / 2, this.height / 2)
        };
    }
}
