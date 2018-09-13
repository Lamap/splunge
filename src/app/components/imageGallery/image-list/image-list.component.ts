import { Component, OnInit } from '@angular/core';
import { ImageCrudService, ImageData } from '../../../services/image-crud.service';

@Component({
  selector: 'spg-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.less']
})
export class ImageListComponent implements OnInit {

  public imageListFirstCol: ImageData[] = [];
  public imageListSecondCol: ImageData[] = [];

  constructor(imageService: ImageCrudService) {
    imageService.imageList$.subscribe(images => {
      this.imageListFirstCol = [];
      this.imageListSecondCol = [];
      images.forEach((image, index) => {
        if (index % 2 === 0) {
          this.imageListFirstCol.push(image);
        } else {
          this.imageListSecondCol.push(image);
        }
      });
    });
  }

  ngOnInit() {
  }

}
