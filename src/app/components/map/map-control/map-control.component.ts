// TODO: rename to map-overlay-control

import {Component, Input, OnInit} from '@angular/core';
import { IMapOverlayItem } from '../map/map.component';

@Component({
  selector: 'spg-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.less']
})
export class MapControlComponent implements OnInit {
  @Input() mapOverlayItems: IMapOverlayItem[];

  constructor() { }

  ngOnInit() {
      console.log(this.mapOverlayItems);
  }

}
