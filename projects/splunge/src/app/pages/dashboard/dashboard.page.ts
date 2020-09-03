import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';
import { SpgPoint, ISpgPoint } from '../../models/spgPoint';
import { ImageService } from '../../services/image.service';
import { ISpgImage } from '../../models/spgImage';

@Component({
  selector: 'spg-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  public markerList: ISpgPoint[] = [];
  public imageList: ISpgImage[] = [];
  private fullImageList: ISpgImage[] = [];
  public selectedImage: ISpgImage;
  private selectedMarker: ISpgPoint;
  constructor(private markerService: MarkersService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.markerService.markerList$.subscribe((snapshot) => {
      this.markerList = snapshot.map(point => new SpgPoint(point));
    });
    this.imageService.queriedImageCollection.subscribe((snapshot) => {
      console.log(snapshot);
      this.fullImageList = snapshot;
      this.filterImages();
    })
  }

  onMarkerClicked(clickedPoint: SpgPoint) {
    this.selectedMarker = clickedPoint;
    // this.imageService.queryByMarkerId(clickedPoint.id);
    this.filterImages(clickedPoint.id);
    this.markerList = this.markerList.map((point) => {
      point.isSelected = clickedPoint.id === point.id;
      return point;
    });
  }

  filterImages(markerFilterId?: string) {
    if (!markerFilterId) {
      return this.imageList = this.fullImageList;
    }
    this.imageList = this.fullImageList.filter(({markerId}) => markerId === markerFilterId);
  }
  clearImageFilter() {
    this.filterImages();
  }
}
