import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageCrudService, ImageData } from '../../../services/image-crud.service';
import { ISpgMarker } from '../../map/map/map.component';

@Component({
  selector: 'spg-image-list-item',
  templateUrl: './image-list-item.component.html',
  styleUrls: ['./image-list-item.component.less']
})
export class ImageListItemComponent implements OnInit {

  @Input() image: ImageData;
  @Input() isAdminMode: boolean;
  @Input() selectedMarker: ISpgMarker;
  @Output() imageClicked$ = new EventEmitter<ImageData>();
  @Output() openImageModal$ = new EventEmitter<ImageData>();
  @Output() pointImageMarker$ = new EventEmitter<ImageData>();
  constructor(private imageService: ImageCrudService) { }

  ngOnInit() {
  }

  deleteImage($image) {
    this.imageService.delete($image);
  }
  itemClicked($image) {
    this.imageClicked$.emit($image);
  }
  openModal($image) {
    this.openImageModal$.emit($image);
  }
  pointImageMarker($image) {
    this.pointImageMarker$.emit($image);
  }
}
