import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageCrudService, ImageData } from '../../../services/image-crud.service';
import { AuthService } from '../../../services/auth.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ISpgMarker } from '../../map/map/map.component';
import * as _ from 'lodash';


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

  @Output() pointImageMarker$ = new EventEmitter<ImageData>();
  @Input() selectedMarker: ISpgMarker;

  private imageModalRef: MatDialogRef<ImageModalComponent, ImageData>;

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
          this.selectedImage = this.getSelectedImage(this.selectedImageId);
      });
      this.imageService.imageListExtended$.subscribe(images => {
          console.log(images);
      });
  }

  imageLoadFromList($event) {
    this.selectedImageId = $event.id;
    this.selectedImage = this.getSelectedImage($event.id);
  }

  getSelectedImage(id: string): ImageData {
    return this.imageList.filter(image => {
        return image.id === id;
    }).pop();
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
      console.log($image);
      this.imageModalRef = this.dialog.open(ImageModalComponent, {
          data: $image
      });
  }

  pointImageMarker($image: ImageData) {
      console.log('point', $image);
      this.pointImageMarker$.emit($image);
  }

  clearHeadImage() {
      this.selectedImageId = null;
      this.selectedImage = null;
  }

  ngOnInit() {
  }
}
