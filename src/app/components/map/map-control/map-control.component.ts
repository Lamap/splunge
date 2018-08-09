// TODO: rename to map-overlay-control

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { IMapOverlayItem } from '../map/map.component';

@Component({
  selector: 'spg-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.less']
})
export class MapControlComponent implements OnInit {
  @Output() $onItemSelected = new EventEmitter<IMapOverlayItem>();
  @Output() $onGoogleMapsSelected = new EventEmitter<Boolean>();
  @Input() mapOverlayItems: IMapOverlayItem[];
  @Input() isGoogleMapOnTop: boolean;

  constructor() { }

  ngOnInit() {
      console.log(this.mapOverlayItems);
  }

  onItemClicked(overlay: IMapOverlayItem) {
    console.log(overlay);
    if (overlay.isTop) {
      return;
    }
    this.$onItemSelected.emit(overlay);
  }

  onGoogleMapsClicked() {
    this.$onGoogleMapsSelected.emit(true);
  }
}
