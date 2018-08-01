import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
declare var google: any;

@Component({
  selector: 'spg-map-overlay-set',
  templateUrl: './map-overlay-set.component.html',
  styleUrls: ['./map-overlay-set.component.less']
})

export class MapOverlaySetComponent implements OnInit, AfterViewInit {

  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
      this._mapsWrapper.getNativeMap().then(gMap => {
          const overlayView = new google.maps.OverlayView();
          overlayView.setMap(gMap);
console.log(gMap);
          overlayView.draw = () => {
          };
      });
  }
}
