import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';
import { SpgPoint, ISpgPoint } from '../../models/spgPoint';
import { ImageService } from '../../services/image.service';
import { ISpgImage } from '../../models/spgImage';
import { ILatLongCoordinate } from '../../widgets/osm-map/osm-map.widget';

@Component({
  selector: 'spg-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  public markerList: ISpgPoint[] = [];
  public imageList: ISpgImage[] = [];
  public selectedImage: ISpgImage;
  public selectedMarker: ISpgPoint;
  private fullImageList: ISpgImage[] = [];
  private markerCreationMode = false;
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

  onMarkerClicked(clickedPoint: ISpgPoint) {
    this.selectedMarker = clickedPoint;
    // this.imageService.queryByMarkerId(clickedPoint.id);
    this.filterImages(clickedPoint.id);
    this.markerList = this.markerList.map((point) => {
      point.isSelected = clickedPoint.id === point.id;
      return point;
    });
  }

  onMarkerRepositioned(updatedMarker: ISpgPoint) {
    this.markerService.updateMarker(updatedMarker as SpgPoint);
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

  addMarker() {
    console.log('add marker');
    this.markerCreationMode = true;
  }
  filterImagelessMarkers() {
    // filtering
  }
  onMapClicked($event: ILatLongCoordinate) {
    if (!this.markerCreationMode) {
      return;
    }
    // TODO: set map cursor type
    this.markerService.createMarker($event);
    this.markerCreationMode = false;
  }
}
