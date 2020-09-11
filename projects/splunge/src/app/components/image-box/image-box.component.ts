import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ISpgImage } from '../../models/spgImage';

@Component({
  selector: 'spg-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss']
})
export class ImageBoxComponent implements OnInit {
  @Input() imageData: ISpgImage;
  @Input() canPoint = true;
  @Input() canLink = false;
  @Input() canUnlink = false;
  @Input() canEdit = true;
  @Output() pointMarker$ = new EventEmitter<ISpgImage>();
  @Output() linkToMarker$ = new EventEmitter<ISpgImage>();
  @Output() removeMarker$ = new EventEmitter<ISpgImage>();
  @Output() deleteImage$ = new EventEmitter<ISpgImage>();
  constructor() { }

  ngOnInit(): void {
  }
  pointMarker() {
    this.pointMarker$.emit(this.imageData);
  }
  linkToMarker() {
    this.linkToMarker$.emit(this.imageData);
  }
  removeMarker() {
    this.removeMarker$.emit(this.imageData);
  }
  deleteImage() {
    this.deleteImage$.emit(this.imageData);
  }
}
