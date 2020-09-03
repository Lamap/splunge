import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';

@Component({
  selector: 'spg-marker-direction',
  templateUrl: './marker-direction.component.html',
  styleUrls: ['./marker-direction.component.scss']
})
export class MarkerDirectionComponent implements OnInit {
  @Input() pointData: ISpgPoint;
  public rotation: string;
  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
    this.rotation = `rotate(${this.pointData.direction}deg)`;
  }

}
