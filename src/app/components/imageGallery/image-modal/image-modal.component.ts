import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageData } from '../../../services/image-crud.service';

@Component({
  selector: 'spg-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.less']
})
export class ImageModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImageModalComponent>, @Inject(MAT_DIALOG_DATA) public image: ImageData) { }

  ngOnInit() {
  }

  closeModal() {
      this.dialogRef.close();
  }

}
