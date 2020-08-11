import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'spg-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent implements OnInit {
  @Input() ltd: number;
  @Input() lng: number;

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  onMarkerClicked() {
    console.log('markerClickedInside');
  }
}
