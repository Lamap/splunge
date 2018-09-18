import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageData } from '../../../services/image-crud.service';
import { ISpgMarker } from '../../map/map/map.component';

@Component({
  selector: 'spg-head-image',
  templateUrl: './head-image.component.html',
  styleUrls: ['./head-image.component.less']
})
export class HeadImageComponent implements OnInit {

  @Output() deleteImage$ = new EventEmitter<ImageData>();
  @Output() updateImage$ = new EventEmitter<ImageData>();
  @Output() openImageModal$ = new EventEmitter<ImageData>();
  @Output() toggleMarkerLink$ = new EventEmitter<ImageData | null>();
  @Output() pointImageMarker$ = new EventEmitter<ImageData>();
  @Input() isAdminMode = false;
  @Input() image: ImageData;
  @Input() selectedMarker: ISpgMarker;
  constructor() { }

  ngOnInit() {
  }

  deleteImage($image) {
    this.deleteImage$.emit($image);
  }
  save($image) {
    this.updateImage$.emit($image);
  }
  openModal($image) {
    this.openImageModal$.emit($image);
  }
  pointImageMarker($image) {
    this.pointImageMarker$.emit($image);
  }
}
