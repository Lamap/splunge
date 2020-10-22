import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface IDisplayZoomRange {
  min: number;
  max: number;
}
export interface IPresentMap {
  id: number;
  name: string;
  date: number;
}
export interface IPastMap {
  id: number;
  name: string;
  date: number;
  opacity: number;
  src: string;
  selected?: boolean;
  displayZoomRange: IDisplayZoomRange;
}

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
