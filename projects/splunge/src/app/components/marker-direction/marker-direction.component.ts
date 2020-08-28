import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ISpgPpoint } from '../../widgets/osm-map/osm-map.widget';

@Component({
  selector: 'spg-marker-direction',
  templateUrl: './marker-direction.component.html',
  styleUrls: ['./marker-direction.component.scss']
})
export class MarkerDirectionComponent implements OnInit {
  @Input() pointData: ISpgPpoint;
  public rotation: string;
  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
    this.rotation = `rotate(${this.pointData.direction}deg)`;
  }

}
