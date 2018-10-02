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
  @Output() $onFitToMapBounds = new EventEmitter<IMapOverlayItem>();
  @Input() mapOverlayItems: IMapOverlayItem[];
  @Input() isGoogleMapOnTop: boolean;
  @Input() mapTransitionDuration: number;

  private canSwitch = true;

  constructor() { }

  ngOnInit() {
      console.log(this.mapOverlayItems);
  }

  onItemClicked(overlay: IMapOverlayItem) {
    if (overlay.isTop || !this.canSwitch) {
      return;
    }
    this.$onItemSelected.emit(overlay);
    this.canSwitch = false;
    setTimeout(() => {
          this.canSwitch = true;
    }, this.mapTransitionDuration);
  }

  onGoogleMapsClicked() {
    if (this.isGoogleMapOnTop) {
      return;
    }
    this.$onGoogleMapsSelected.emit(true);
  }

  onFitBoundsClicked(overlay: IMapOverlayItem) {
    this.$onFitToMapBounds.emit(overlay);
  }
}
