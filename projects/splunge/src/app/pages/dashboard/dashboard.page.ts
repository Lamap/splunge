import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MarkersService } from '../../services/markers.service';
import { SpgPoint, ISpgPoint } from '../../models/spgPoint';
import { ImageService } from '../../services/image.service';
import { ISpgImage, SpgImage } from '../../models/spgImage';
import { ISpgCoordinates, OsmMapWidget } from '../../widgets/osm-map/osm-map.widget';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'spg-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  public markerList: ISpgPoint[] = [];
  public fullImageList: ISpgImage[] = [];
  public linkedImageList: ISpgImage[] = [];
  public freeImageList: ISpgImage[] = [];
  public selectedImage: ISpgImage;
  public selectedMarker: ISpgPoint;
  public markerCreationMode = false;

  @ViewChild('editorpane', { static: false }) editorPane: ElementRef;
  @ViewChild(OsmMapWidget) map: OsmMapWidget;

  constructor(private markerService: MarkersService, private imageService: ImageService, private mapService: MapService) { }

  ngOnInit(): void {
    this.markerService.filteredMarkerList$.subscribe((snapshot) => {
      this.markerList = snapshot.map((point) => {
        const spgPoint = point;
        if (this.selectedMarker && this.selectedMarker.id === spgPoint.id) {
          spgPoint.isSelected = true;
        }
        return spgPoint;
      });
      console.log('markerList');
    });
    this.imageService.fullImageCollection$.subscribe((snapshot) => {
      this.fullImageList = snapshot.map(image => new SpgImage(image) as ISpgImage);
      console.log('imageList');
      this.splitImagesByMarkerId(this.selectedMarker && this.selectedMarker.id);
    });
  }

  mapBoundaryChanged(boundary) {
    this.mapService.setMapBoundary(boundary);
  }

  onMarkerClicked(clickedPoint: ISpgPoint) {
    this.selectedMarker = clickedPoint;
    this.splitImagesByMarkerId(clickedPoint.id);
    this.markerList = this.markerList.map((point) => {
      point.isSelected = clickedPoint.id === point.id;
      point.isPointed = false;
      return point;
    });
  }

  deselectMarker() {
    this.selectedMarker = null;
    this.markerList = this.markerList.map((point) => {
      point.isSelected = false;
      return point;
    });
    this.splitImagesByMarkerId();
  }

  markerChanged() {
    console.log(this.selectedMarker);
    this.markerService.updateMarker(this.selectedMarker as SpgPoint);
  }

  onMarkerRepositioned(updatedMarker: ISpgPoint) {
    this.markerService.updateMarker(updatedMarker as SpgPoint);
  }

  splitImagesByMarkerId(markerFilterId?: string) {
    this.editorPane.nativeElement.scrollTop = 0;
    this.freeImageList = [];
    this.linkedImageList = [];
    if (!markerFilterId) {
      return;
    }

    this.fullImageList.forEach((image) => {
      console.log(markerFilterId, image.markerId);
      if (image.markerId && image.markerId === markerFilterId) {
        this.linkedImageList.push(image);
      } else {
        this.freeImageList.push(image);
      }
    });
  }

  addMarker() {
    console.log('add marker');
    this.markerCreationMode = true;
  }
  cancelAddMarker() {
    this.markerCreationMode = false;
  }
  onMapClicked($event: ISpgCoordinates) {
    if (!this.markerCreationMode) {
      return;
    }
    // TODO: set map cursor type
    this.markerService.createMarker($event);
    this.markerCreationMode = false;
  }

  pointMarkerFromImage(image: SpgImage) {
    console.log('point', image);
    this.markerList = this.markerList.map((marker) => {
      marker.isPointed = marker.id === image.markerId;
      return marker;
    });
    const pointedMarker = this.markerList.find(({id}) => id === image.markerId);
    this.map.centerMarker(pointedMarker as SpgPoint);
  }

  uploadImage(file: File) {
    this.imageService.addNewImage(file);
  }

  deleteMarker() {
    console.log('delete', this.selectedMarker);
    this.markerService.deleteMarker(this.selectedMarker as SpgPoint);
    this.selectedMarker = null;
  }
  linkImageToMarker(image: SpgImage) {
    console.log('linkto', image);
    this.imageService.updateImage(image.id, {
      markerId: this.selectedMarker.id
    });
    // TODO: images list is not updated!
  }
  switchImageMarker(image: SpgImage) {
    console.log('switchMarker');
  }
  removeMarker(image: SpgImage) {
    this.imageService.updateImage(image.id, {
      markerId: null
    });
  }
  deleteImage(image: SpgImage) {
    this.imageService.deleteImage(image);
  }
}
