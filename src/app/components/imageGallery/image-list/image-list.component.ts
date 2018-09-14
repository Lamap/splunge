import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ImageData } from '../../../services/image-crud.service';

@Component({
  selector: 'spg-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.less']
})
export class ImageListComponent implements OnInit, OnChanges {

  public imageListFirstCol: ImageData[] = [];
  public imageListSecondCol: ImageData[] = [];
  public sortedDesc = true;
  public searchText = '';

  @Input() isAdminMode: boolean;
  @Input() imageList: ImageData[];
  @Output() imageSelected$ = new EventEmitter<ImageData>();
  @Output() queryChanged$ = new EventEmitter<any>();

  constructor() {}

    // TODO: doit it with subscribe instead of ngChange
    ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.imageList && changes.imageList.currentValue) {
      this.imageListFirstCol = [];
      this.imageListSecondCol = [];
      changes.imageList.currentValue.forEach((image, index) => {
          if (index % 2 === 0) {
              this.imageListFirstCol.push(image);
          } else {
              this.imageListSecondCol.push(image);
          }
      });
    }
  }

  onItemClicked ($image) {
    this.imageSelected$.emit($image);
  }

  ngOnInit() {
  }

  toggleUploadSort() {
    this.sortedDesc = !this.sortedDesc;
    this.queryChanged$.emit({
        sortedDesc: this.sortedDesc,
        searchText: this.searchText
    });
  }

  filter() {
      this.queryChanged$.emit({
          sortedDesc: this.sortedDesc,
          searchText: this.searchText
      });
  }

}
