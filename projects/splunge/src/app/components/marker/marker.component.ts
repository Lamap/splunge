import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ISpgPpoint } from '../../widgets/osm-map/osm-map.widget';

@Component({
  selector: 'spg-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent implements OnInit {
  @Input() pointData: ISpgPpoint;

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  onMarkerClicked() {
    console.log('markerClickedInside');
  }
}
