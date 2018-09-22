import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ImageData, ImageQuery } from '../../../services/image-crud.service';
import { ISpgMarker } from '../../map/map/map.component';

@Component({
  selector: 'spg-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.less']
})
export class ImageListComponent implements OnInit, OnChanges {

  public imageListFirstCol: ImageData[] = [];
  public imageListSecondCol: ImageData[] = [];
  public sortedDesc = true;
  public noLocationQuery = false;

  @Input() isAdminMode: boolean;
  @Input() imageList: ImageData[];
  @Input() selectedMarker: ISpgMarker;
  @Output() imageSelected$ = new EventEmitter<ImageData>();
  @Output() queryChanged$ = new EventEmitter<ImageQuery | null>();
  @Output() openImageModal$ = new EventEmitter<ImageData>();
  @Output() pointImageMarker$ = new EventEmitter<ImageData>();

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

  openImageModal ($image) {
    this.openImageModal$.emit($image);
  }

  ngOnInit() {
  }

  toggleUploadSort() {
    this.sortedDesc = !this.sortedDesc;
    const imageQuery: ImageQuery = {
        sort: {
            by: 'filePath',
            desc: this.sortedDesc
        }
    };
    this.queryChanged$.emit(imageQuery);
  }

  noLocationQueryChanged() {
      this.queryChanged$.emit({
          noLocation: this.noLocationQuery
      });
  }

  clearQuery() {
      this.queryChanged$.emit({
          sort: {
              by: 'filePath',
              desc: this.sortedDesc
          },
          markerId: null,
          timeInterval: null,
          noLocation: false
      });
  }

  pointImageMarker($image) {
      this.pointImageMarker$.emit($image);
  }

}
