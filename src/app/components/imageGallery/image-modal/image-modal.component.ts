import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageData } from '../../../services/image-crud.service';
import { IModalImageData } from '../image-control/image-control.component';

@Component({
  selector: 'spg-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.less']
})
export class ImageModalComponent implements OnInit {

  public image: ImageData;

  constructor(
      public dialogRef: MatDialogRef<ImageModalComponent>,
      @Inject(MAT_DIALOG_DATA) public modalData: IModalImageData) {
    this.image = this.modalData.imageList[this.modalData.selected];
  }

  ngOnInit() {
  }

  closeModal() {
      this.dialogRef.close();
  }

  changeImage(direction) {
    if (direction === 'LEFT') {
        this.modalData.selected = this.modalData.selected === 0 ? this.modalData.imageList.length - 1 : this.modalData.selected - 1;
    }
    if (direction === 'RIGHT') {
        this.modalData.selected = this.modalData.selected === this.modalData.imageList.length - 1 ? 0 : this.modalData.selected + 1;
    }
    this.image = this.modalData.imageList[this.modalData.selected];
  }
}
