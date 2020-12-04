import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPastMap, IPresentMap } from '../../services/map.service';

@Component({
  selector: 'spg-map-selector-footer',
  templateUrl: './map-selector-footer.widget.html',
  styleUrls: ['./map-selector-footer.widget.scss']
})
export class MapSelectorFooterWidget implements OnInit {
  @Input() presentMaps: IPresentMap[];
  @Input() pastMaps: IPastMap[];
  @Output() mapSelected$ = new EventEmitter<IPastMap>();
  constructor() { }

  ngOnInit(): void {
  }

  pastMapClicked($event) {
    console.log($event);
    this.mapSelected$.emit($event);
  }
}
