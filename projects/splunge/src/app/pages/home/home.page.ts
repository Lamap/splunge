import { Component, OnInit } from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';
import { MarkersService } from '../../services/markers.service';

import { IPastMap, IPresentMap } from '../../services/map.service';
import { MapService } from '../../services/map.service';
import { ISpgImage } from '../../models/spgImage';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'spg-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  public markerList: ISpgPoint[] = [];
  public presentMaps: IPresentMap[];
  public pastMaps: IPastMap[];

  public images: ISpgImage[];
  constructor(private markerService: MarkersService, private mapService: MapService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.mapService.pastMaps$.subscribe(value => this.pastMaps = value);
    this.mapService.presentMaps$.subscribe(value => this.presentMaps = value);
    this.markerService.markersOfBoundary$.subscribe(markers => {
      this.markerList = markers;
      console.log('markersOfBoundary$', markers);
    });
    this.markerService.imageFilteredMarkersOfBoundary$.subscribe(markers => console.log('imageFilteredMarkersOfBoundary$', markers));
    this.imageService.dataFilteredImagesOfBoundary$.subscribe(imagesSnapshot => this.images = imagesSnapshot);
  }

  mapBoundaryChanged(boundary) {
    this.mapService.setMapBoundary(boundary);
  }

  selectPastMap(selectedMap: IPastMap) {
    this.pastMaps = this.pastMaps.map(map => {
      map.selected = map.id === selectedMap.id;
      return map;
    });
  }
}

