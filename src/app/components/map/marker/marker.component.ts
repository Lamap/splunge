import { Component, OnInit, Input, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
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

    @Input() markerPoint: ISpgMarker;
    @Input() isAdminMode: boolean;
    @Input() isSelected: boolean;

    @Output() $markerSelected = new EventEmitter<ISpgMarker>();
    @Output() $markerRepositioned = new EventEmitter<ISpgMarker>();

    public iconUrl;

    private width = 400;
    private height = 400;

    constructor(protected _mapsWrapper: GoogleMapsAPIWrapper, private markerGenerator: SymbolFactoryService) {
    }

    ngOnInit() {}

    ngAfterViewInit() {
        this._mapsWrapper.getNativeMap().then(gMap => {
            this.drawMarker();
        });
    }

    ngOnChanges(simpleChange) {
        if (simpleChange && simpleChange.isSelected) {
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
                this.isSelected),
            scale: 1,
            anchor: new google.maps.Point(this.width / 2, this.height / 2)
        };
    }
}
