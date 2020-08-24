import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'spg-clusterpoint',
  templateUrl: './clusterpoint.component.html',
  styleUrls: ['./clusterpoint.component.scss']
})
export class ClusterpointComponent implements OnInit {
  @Input() markers: any[];
  @Input() clusterCenter: any;

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
  }

}
