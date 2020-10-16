import { Component, OnInit, Input } from '@angular/core';

export interface IPresentMap {
  name: string;
  date: number;
}
export interface IPastMap {
  name: string;
  date: number;
  opacity: number;
  src: string;
}

@Component({
  selector: 'spg-map-selector-footer',
  templateUrl: './map-selector-footer.widget.html',
  styleUrls: ['./map-selector-footer.widget.scss']
})
export class MapSelectorFooterWidget implements OnInit {
  @Input() presentMaps: IPresentMap[];
  @Input() pastMaps: IPastMap[];
  constructor() { }

  ngOnInit(): void {
  }

}
