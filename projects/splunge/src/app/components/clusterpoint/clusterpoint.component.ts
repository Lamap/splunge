import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { IClusterPoint } from '../../widgets/osm-map/osm-map.widget';

@Component({
  selector: 'spg-clusterpoint',
  templateUrl: './clusterpoint.component.html',
  styleUrls: ['./clusterpoint.component.scss']
})
export class ClusterpointComponent implements OnInit {
  @Input() clusterData: IClusterPoint;

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
  }

}
