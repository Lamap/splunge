import { Component, OnInit } from '@angular/core';
import { ImageCrudService, ImageData } from '../../../services/image-crud.service';
import { AuthService } from '../../../services/auth.service';

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

  constructor(private authService: AuthService, private imageService: ImageCrudService) {
      authService.user$.subscribe(user => {
          if (user) {
              this.isAdminMode = true;
          } else {
              this.isAdminMode = false;
          }
      });
      this.imageService.imageList$.subscribe(images => {
          this.imageList = images;
          this.selectedImage = this.getSelectedImage(this.selectedImageId);
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
      this.imageService.query$.next($event);
  }

  ngOnInit() {
  }
}