import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GoogleMapsAPIWrapper } from '../../../../../node_modules/@agm/core/services/google-maps-api-wrapper';

@Component({
  selector: 'spg-map-helper',
  templateUrl: './map-helper.component.html',
  styleUrls: ['./map-helper.component.less']
})
export class MapHelperComponent implements OnInit {
  @Output() nativeMap$ = new EventEmitter();

  private nativeMap: any;

  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) {
    this._mapsWrapper.getNativeMap().then(map => {
      this.nativeMap = map;
      this.nativeMap$.emit(map);
    });
  }

  ngOnInit() {
  }

}
