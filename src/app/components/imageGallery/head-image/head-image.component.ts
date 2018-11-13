import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ImageData } from '../../../services/image-crud.service';
import { ISpgMarker } from '../../map/map/map.component';

@Component({
  selector: 'spg-head-image',
  templateUrl: './head-image.component.html',
  styleUrls: ['./head-image.component.less']
})
export class HeadImageComponent implements OnInit, OnChanges {

  @Output() deleteImage$ = new EventEmitter<ImageData>();
  @Output() updateImage$ = new EventEmitter<ImageData>();
  @Output() openImageModal$ = new EventEmitter<ImageData>();
  @Output() toggleMarkerLink$ = new EventEmitter<ImageData | null>();
  @Output() pointImageMarker$ = new EventEmitter<ImageData>();
  @Output() clearHeadImage$ = new EventEmitter<void>();
  @Output() changeSelectedImageIndex$ = new EventEmitter<String>();
  @Input() isAdminMode = false;
  @Input() image: ImageData;
  @Input() selectedMarker: ISpgMarker;
  @Input() selectedImageIndex: number;

  public isUnsaved = false;
  constructor() { }

  ngOnInit() {
  }

  deleteImage($image) {
    this.deleteImage$.emit($image);
  }
  save($image) {
    this.updateImage$.emit($image);
    this.isUnsaved = false;
  }
  openModal($image) {
    this.openImageModal$.emit($image);
  }
  pointImageMarker($image) {
    this.pointImageMarker$.emit($image);
  }
  close() {
    this.clearHeadImage$.emit();
  }
  dataChanged() {
    this.isUnsaved = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.image) {
      this.isUnsaved = false;
    }
  }

  changeImageIndex(direction) {
    this.changeSelectedImageIndex$.emit(direction);
  }
}
