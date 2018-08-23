import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
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
export class MarkerComponent implements OnInit, AfterViewInit {

    @Input() options: ISpgPoint;

    public iconUrl;

    private width = 400;
    private height = 400;

    constructor(protected _mapsWrapper: GoogleMapsAPIWrapper, private markerGenerator: SymbolFactoryService) {
    }

    ngOnInit() {}

    ngAfterViewInit() {
        console.log('marker added', this.options);
        this._mapsWrapper.getNativeMap().then(gMap => {
            this.iconUrl = {
                url: this.markerGenerator.generate(0, this.width, this.height),
                scale: 1,
                anchor: new google.maps.Point(200, 200)
            };
        });
    }
}
