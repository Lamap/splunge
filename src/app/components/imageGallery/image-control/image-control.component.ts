import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageCrudService, ImageData } from '../../../services/image-crud.service';
import { AuthService } from '../../../services/auth.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ISpgMarker } from '../../map/map/map.component';
import * as _ from 'lodash';

export interface IModalImageData {
    imageList: ImageData[];
    selected: number;
}

@Component({
  selector: 'spg-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.less']
})

export class ImageControlComponent implements OnInit {

  public isAdminMode = false;
  public imageList: ImageData[];
  public selectedImageId: string;
  public selectedImage: ImageData;
  public selectedImageIndex = 0;

  @Output() pointImageMarker$ = new EventEmitter<ImageData>();
  @Input() selectedMarker: ISpgMarker;

  private imageModalRef: MatDialogRef<ImageModalComponent, IModalImageData>;

  constructor(private authService: AuthService, private imageService: ImageCrudService, private dialog: MatDialog) {
      authService.user$.subscribe(user => {
          if (user) {
              this.isAdminMode = true;
          } else {
              this.isAdminMode = false;
          }
      });
      this.imageService.imageListExtended$.subscribe(images => {
          this.imageList = images;
          this.selectedImageIndex = this.getSelectedImageIndex(this.selectedImageId);
          this.selectedImage = this.getSelectedImage(this.selectedImageId);
      });
  }

  imageLoadFromList($event) {
    this.selectedImageId = $event.id;
    this.selectedImageIndex = this.getSelectedImageIndex($event.id);
    this.selectedImage = this.getSelectedImage($event.id);
  }

  getSelectedImage(id: string): ImageData {
    return this.imageList.filter(image => {
        return image.id === id;
    }).pop();
  }

  getSelectedImageIndex(id: string): number {
    return this.imageList.findIndex(image => image.id === id);
  }

  fileSelected($event: File) {
    this.imageService.upload($event, image => this.onImageSaved(image));
  }

  onImageSaved(newImage: ImageData) {
    this.selectedImageId = newImage.id;
    this.selectedImage = this.getSelectedImage(this.selectedImageId);
  }

  deleteImage($image) {
      this.imageService.delete($image);
  }

  updateImage($image) {
      this.imageService.update($image);
  }

  queryChanged($event) {
      console.log('query', $event);
      const newQuery = _.merge(this.imageService.query$.getValue(), $event);
      this.imageService.query$.next(newQuery);
  }

  openImageModal($image: ImageData) {
      this.selectedImageIndex = this.getSelectedImageIndex($image.id);
      this.imageModalRef = this.dialog.open(ImageModalComponent, {
          data: {
              imageList: this.imageList,
              selected: this.getSelectedImageIndex($image.id)
            }
      });
  }

  pointImageMarker($image: ImageData) {
      this.pointImageMarker$.emit($image);
  }

  clearHeadImage() {
      this.selectedImageId = null;
      this.selectedImage = null;
  }

  ngOnInit() {
  }

  imageIndexChanged($event) {
      console.log($event);
      if ($event === 'LEFT') {
          this.selectedImageIndex = this.selectedImageIndex === 0 ?
              this.imageList.length - 1 :
              this.selectedImageIndex - 1;
      }
      if ($event === 'RIGHT') {
          this.selectedImageIndex = this.selectedImageIndex === this.imageList.length - 1 ?
              0 :
              this.selectedImageIndex + 1;
      }
      this.selectedImage = this.imageList[this.selectedImageIndex];
      this.selectedImageId = this.selectedImage.id;
  }
}
