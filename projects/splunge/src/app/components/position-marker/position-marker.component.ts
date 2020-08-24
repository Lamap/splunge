import {Component, ElementRef, OnInit} from '@angular/core';

@Component({
  selector: 'spg-position-marker',
  templateUrl: './position-marker.component.html',
  styleUrls: ['./position-marker.component.scss']
})
export class PositionMarkerComponent implements OnInit {

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
  }

}
