import { Component, OnInit, Output, Input, EventEmitter, OnChanges,
    SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ImageCrudService, ImageData, ImageQuery } from '../../../services/image-crud.service';
import { ISpgMarker } from '../../map/map/map.component';

@Component({
  selector: 'spg-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.less']
})
export class ImageListComponent implements OnInit, OnChanges, AfterViewInit {

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
  @Output() fileSelected$ = new EventEmitter<File>();

  @ViewChild('scrollcontainer') scrollContainer;

  public isFiltered: boolean;

  constructor(private imageService: ImageCrudService) {}

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
    this.imageService.query$.subscribe(query => {
       this.isFiltered = typeof query.markerId === 'string' || query.noLocation;
    });

  }

  ngAfterViewInit() {
      console.log(this.scrollContainer);
      this.scrollContainer.nativeElement.onscroll = () => {
          this.onScroll();
      };
  }

  onScroll () {
      const scrollPosition = this.scrollContainer.nativeElement.scrollTop;
      const scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
      const containerHeight = this.scrollContainer.nativeElement.offsetHeight;
      const buffer = 20;
      if (scrollPosition + containerHeight >= scrollHeight - buffer) {
          this.loadMoreImages();
      }
  }

  loadMoreImages () {
      const query = this.imageService.query$.getValue();
      const increment = 6;
      if (query.limit + increment <= this.imageList.length + increment) {
          query.limit = query.limit + increment;
          this.imageService.query$.next(query);
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
    const by = this.isAdminMode ? 'filePath' : 'dated';
    this.sortedDesc = !this.sortedDesc;
    const imageQuery: ImageQuery = {
        sort: {
            by: by,
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
      this.noLocationQuery = false;
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

  fileSelected($event) {
      this.fileSelected$.emit($event);
  }

}
