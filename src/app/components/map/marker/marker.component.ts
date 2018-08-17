import { Component, OnInit, Input } from '@angular/core';
import {ISpgPoint} from '../map/map.component';
//import { google } from '../../../../../node_modules/@agm/core/services/google-maps-types';
declare var google: any; // TODO: get proper typing

@Component({
  selector: 'spg-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.less']
})
export class MarkerComponent implements OnInit {

  @Input() options: ISpgPoint;

  // public iconUrl = 'https://dummyimage.com/20x20/b06e27/e69c12&text=0';
  public iconUrl;

  constructor() { }

  ngOnInit() {
    console.log('marker added', this.options);
    /*
    this.iconUrl = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 5,
        rotation: 33
    };
    */
    /*
      this.iconUrl = {
          //path: 'M 0,0  A10,10 0 1,0 1,1 M 0 0 L -35 -100 L 35 -100 z',
          path: 'M 40,72\n' +
          '        C 22.4,72,8,57.6,8,40\n' +
          '        C 8,22.4,22.4,8,40,8\n' +
          '        c 17.6,0,32,14.4,32,32\n' +
          '        c 0,1.1-0.9,2-2,2\n' +
          '        s -2-0.9-2-2\n' +
          '        c 0-15.4-12.6-28-28-28\n' +
          '        S 12,24.6,12,40\n' +
          '        s 12.6,28,28,28\n' +
          '        c 1.1,0,2,0.9,2,2\n' +
          '        S 41.1,72,40,72 z',
          fillColor: '#3884ff',
          fillOpacity: 0.7,
          scale: 1,
          strokeColor: '#356cde',
          rotation: 90,
          strokeWeight: 1
      };
      */
      const xyz = 'data:image/svg+xml;utf-8, \
    <svg width="30" height="60" xmlns="http://www.w3.org/2000/svg"> \
        <defs><linearGradient id="mygx"> \
            <stop offset="5%" stop-color="black"/> \
            <stop offset="95%" stop-color="red"/> \
        </linearGradient></defs> \
        <path fill="url(\u0023mygx)" stroke="black" stroke-width="1.5" d="M0 0 L0 35 L15 60 L30 35 L30 0 L0 0Z"></path> \
        </svg>';
      this.iconUrl = {
          url: xyz,
          fillOpacity: 0.7,
          scale: 1
      };;
  }

}
