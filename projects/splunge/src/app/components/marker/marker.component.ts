import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';

@Component({
  selector: 'spg-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent implements OnInit {
  @Input() pointData: ISpgPoint;

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  onMarkerClicked() {
    console.log('markerClickedInside');
  }
}
