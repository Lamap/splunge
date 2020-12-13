import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
import { ISpgImage } from '../../models/spgImage';

@Component({
  selector: 'spg-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, OnChanges {
  @Input() images: ISpgImage[];
  @Input() colCount = 3;
  public structured: ISpgImage[][];
  public colClass: string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.images) {
      this.computeImageCols();
    }
  }

  computeImageCols() {
    this.colClass = `spg-image-list__col--count-${this.colCount}`;
    if (!this.images) {
      return;
    }
    this.structured = [];
    this.images.forEach((image, index) => {
      const colIndex = index % this.colCount;
      if (!this.structured[colIndex]) {
        this.structured[colIndex] = [image];
      } else {
        this.structured[colIndex].push(image);
      }
    });
    console.log(this.structured);
  }

  tempClick(image: ISpgImage) {
    image.isSelected = true;
    console.log('selected', image);
  }

}
