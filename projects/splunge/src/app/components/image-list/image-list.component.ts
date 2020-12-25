import { Component, OnInit, Input } from '@angular/core';
import { ISpgImage } from '../../models/spgImage';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators';

@Component({
  selector: 'spg-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit {
  @Input() images: Observable<ISpgImage[]>;
  @Input() colCount = 3;
  public structured: Observable<ISpgImage[][]>;
  public colClass: string;

  constructor() { }

  ngOnInit(): void {
    this.structured = this.images.pipe(switchMap(images => {
      this.colClass = `spg-image-list__col--count-${this.colCount}`;
      if (!images) {
        return [];
      }
      const structured = [];
      images.forEach((image, index) => {
        const colIndex = index % this.colCount;
        if (!structured[colIndex]) {
          structured[colIndex] = [];
        }
        structured[colIndex].push(image);
      });
      console.log('structured inside', structured);
      return of(structured);
    }));
    this.structured.subscribe(blabla => console.log('this.structured.subscribe', blabla));
  }

  tempClick(image: ISpgImage) {
    // image.isSelected = true;
    console.log('selected', image);
  }

}
