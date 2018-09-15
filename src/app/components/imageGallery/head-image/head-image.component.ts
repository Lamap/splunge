import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageData } from '../../../services/image-crud.service';

@Component({
  selector: 'spg-head-image',
  templateUrl: './head-image.component.html',
  styleUrls: ['./head-image.component.less']
})
export class HeadImageComponent implements OnInit {

  @Output() deleteImage$ = new EventEmitter<ImageData>();
  @Output() updateImage$ = new EventEmitter<ImageData>();
  @Output() openImageModal$ = new EventEmitter<ImageData>();
  @Input() isAdminMode = false;
  @Input() image: ImageData;
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
}
