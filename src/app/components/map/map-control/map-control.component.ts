// TODO: rename to map-overlay-control

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { IMapOverlayItem } from '../map/map.component';

@Component({
  selector: 'spg-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.less']
})
export class MapControlComponent implements OnInit {
  @Output() $onItemClicked = new EventEmitter<IMapOverlayItem>();
  @Input() mapOverlayItems: IMapOverlayItem[];

  constructor() { }

  ngOnInit() {
      console.log(this.mapOverlayItems);
  }

  onItemClicked(overlay: IMapOverlayItem) {
    console.log(overlay);
    this.$onItemClicked.emit(overlay);
  }

}
