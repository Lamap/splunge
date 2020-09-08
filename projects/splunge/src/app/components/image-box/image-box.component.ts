import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ISpgImage } from '../../models/spgImage';

@Component({
  selector: 'spg-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss']
})
export class ImageBoxComponent implements OnInit {
  @Input() imageData: ISpgImage;
  @Output() pointMarker$ = new EventEmitter<ISpgImage>();
  constructor() { }

  ngOnInit(): void {
  }
  pointMarker() {
    this.pointMarker$.emit(this.imageData);
  }
}
