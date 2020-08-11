import { Component, OnInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'spg-marker-direction',
  templateUrl: './marker-direction.component.html',
  styleUrls: ['./marker-direction.component.scss']
})
export class MarkerDirectionComponent implements OnInit {
  @Input() ltd: number;
  @Input() lng: number;
  @Input() direction: number;
  public rotation: string;
  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
    this.rotation = `rotate(${this.direction}deg)`;
    console.log(this.rotation);
  }

}
