import { Component, OnInit } from '@angular/core';
import { ImageCrudService } from '../../../services/image-crud.service';

@Component({
  selector: 'spg-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.less']
})
export class ImageControlComponent implements OnInit {

  constructor(private imageService: ImageCrudService) {}

  ngOnInit() {
  }

  uploadFiles($event) {
    console.log('uploadFiles', $event);
    /*
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);
      */
      this.imageService.upload($event);
  }

}
