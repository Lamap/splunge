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
  @Output() $onRemoveItem = new EventEmitter<IMapOverlayItem>();
  @Output() $onSwapItems = new EventEmitter<VoidFunction>();
  @Output() $onFitToMapBounds = new EventEmitter<IMapOverlayItem>();
  @Input() mapOverlayItems: IMapOverlayItem[];
  @Input() mapTransitionDuration: number;
  @Input() comparedOverlays: IMapOverlayItem[];

  private canSwitch = true;

  constructor() { }

  ngOnInit() {
      console.log(this.mapOverlayItems);
  }

  onItemClicked(overlay: IMapOverlayItem) {
    if (overlay.isDisplayed || !this.canSwitch) {
      return;
    }
    this.$onItemSelected.emit(overlay);
    this.canSwitch = false;
    setTimeout(() => {
          this.canSwitch = true;
    }, this.mapTransitionDuration);
  }

  onFitBoundsClicked(overlay: IMapOverlayItem) {
    this.$onFitToMapBounds.emit(overlay);
  }
  removeFromCompare(overlay: IMapOverlayItem) {
    this.$onRemoveItem.emit(overlay);
  }
  swapComparedItems() {
    console.log('swap');
    this.$onSwapItems.emit();
  }
  setOpacity(value) {
    this.comparedOverlays[0].opacity = value;
  }
}
