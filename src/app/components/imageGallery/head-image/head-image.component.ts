import { Component, OnInit, Input } from '@angular/core';
import { ImageCrudService, ImageData } from '../../../services/image-crud.service';

@Component({
  selector: 'spg-head-image',
  templateUrl: './head-image.component.html',
  styleUrls: ['./head-image.component.less']
})
export class HeadImageComponent implements OnInit {

  @Input() isAdminMode = false;
  @Input() image: ImageData;
  constructor(private imageService: ImageCrudService) { }

  ngOnInit() {
  }

  fileSelected($event: File) {
    this.imageService.upload($event, image => this.onImageSaved(image));
  }

  onImageSaved(newImage: ImageData) {
    this.image = newImage;
    // TODO: message - This image is already uploaded, now you can add information either delete if you do not need
  }

}
