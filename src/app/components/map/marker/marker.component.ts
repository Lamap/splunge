import { Component, OnInit, Input, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import {ISpgPoint} from '../map/map.component';
import {SymbolFactoryService} from '../../../services/symbol-factory.service';
import {GoogleMapsAPIWrapper} from '../../../../../node_modules/@agm/core/services/google-maps-api-wrapper';
// import { google } from '../../../../../node_modules/@agm/core/services/google-maps-types';
declare var google: any; // TODO: get proper typing

@Component({
  selector: 'spg-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.less']
})
export class MarkerComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() markerPoint: ISpgPoint;
    @Input() isAdminMode: boolean;

    @Output() $markerSelected = new EventEmitter<ISpgPoint>();
    @Output() $markerRepositioned = new EventEmitter<ISpgPoint>();

    public iconUrl;

    private width = 400;
    private height = 400;

    constructor(protected _mapsWrapper: GoogleMapsAPIWrapper, private markerGenerator: SymbolFactoryService) {
    }

    ngOnInit() {}

    ngAfterViewInit() {
        console.log('marker added', this.markerPoint);
        this._mapsWrapper.getNativeMap().then(gMap => {
            this.iconUrl = {
                url: this.markerGenerator.generate(
                    this.markerPoint.direction,
                    this.width, this.height,
                    this.markerPoint.hasDirection,
                    this.markerPoint.isActual),
                scale: 1,
                anchor: new google.maps.Point(this.width / 2, this.height / 2)
            };
        });
    }

    ngOnChanges(simpleChange) {
        console.log('markerChanged', simpleChange);
    }

    public markerClicked() {
        this.$markerSelected.emit(this.markerPoint);
    }

    public markerDropped($event) {
        this.markerPoint.longitude = $event.coords.lng;
        this.markerPoint.latitude = $event.coords.lat;
        this.$markerRepositioned.emit(this.markerPoint);
    }
}
