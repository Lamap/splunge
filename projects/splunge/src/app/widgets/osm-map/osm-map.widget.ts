import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList} from '@angular/core';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import Overlay from 'ol/Overlay';
import Static from 'ol/source/ImageStatic';
import { transformExtent } from 'ol/proj';
import { MarkerComponent } from '../../components/marker/marker.component';
import { MarkerDirectionComponent } from '../../components/marker-direction/marker-direction.component';
import {ClusterpointComponent} from '../../components/clusterpoint/clusterpoint.component';
import { PositionMarkerComponent } from '../../components/position-marker/position-marker.component';

export interface ISpgPpoint {
  ltd: number;
  lng: number;
  direction: null | number;
}
export interface IMapBoundary {
  north: number;
  west: number;
  east: number;
  south: number;
}

@Component({
  selector: 'spg-osm-map',
  templateUrl: './osm-map.widget.html',
  styleUrls: ['./osm-map.widget.scss']
})
export class OsmMapWidget implements OnInit, AfterViewInit {
  @ViewChild('osmMapContainer', { static: false }) osmMap: ElementRef;
  @ViewChild(PositionMarkerComponent, { static: false }) positionMarker: PositionMarkerComponent;
  @ViewChildren(MarkerComponent) markersList: QueryList<MarkerComponent>;
  @ViewChildren(MarkerDirectionComponent) markersDirectionsList: QueryList<MarkerDirectionComponent>;
  @ViewChildren(ClusterpointComponent) clusterPointElements: QueryList<ClusterpointComponent>;

  public points = [
    {
      lng: 19.0472,
      ltd: 47.4869,
      direction: 12
    },
    {
      lng: 19.0482,
      ltd: 47.4879,
      direction: 80
    },
    {
      lng: 19.0486,
      ltd: 47.4889
    },
    {
      lng: 19.0490,
      ltd: 47.4879
    },
    {
      lng: 19.0496,
      ltd: 47.4879,
      direction: 210
    }
  ];
  public visiblePoints = [];
  public zoom: number;
  public clusterPoints = [];

  private map: Map;
  private markerOverlays: Overlay[] = [];
  private directionOverlays: Overlay[] = [];
  private mapBoundary: IMapBoundary;
  private positionOverlay: Overlay;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.map = new Map({
      target: this.osmMap.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new ImageLayer({
          minZoom: 10,
          maxZoom: 25,
          source: new Static({
            url: 'http://hspartacus.hu/budakeszi/mm.jpg',
            imageExtent: [18.92185, 47.49267, 18.94555, 47.50704],
            projection: 'EPSG:4326'
          }),
          opacity: 0.4
        })
      ],
      view: new View({
        center: fromLonLat([18.92182, 47.50685]),
        zoom: 20/*,
        projection: 'EPSG:900913'*/
      })
    });

    this.markersList.forEach((marker) => {
      const markerOverlay = new Overlay({
        position: fromLonLat([marker.lng, marker.ltd]),
        element: marker.elementRef.nativeElement,
        positioning: 'center-center'
      });
      this.markerOverlays.push(markerOverlay);
    });

    // Directions must be on separated layer because should not cover marker signs
    this.markersDirectionsList.forEach((markerDirection) => {
      const directionOverlay = new Overlay({
        position: fromLonLat([markerDirection.lng, markerDirection.ltd]),
        element: markerDirection.elementRef.nativeElement,
        positioning: 'center-center'
      });
      this.directionOverlays.push(directionOverlay);
    });
/*
    this.map.on('moveend', (event) => {
      const newZoom = this.map.getView().getZoom();
      const [south, west, north, east] = this.map.getView().calculateExtent();
      this.mapBoundary = {
        north,
        west,
        south,
        east
      }
      if (newZoom !== this.zoom) {
        this.zoom = newZoom;
        return this.drawMarkers(true);
      }
      this.drawMarkers();
    });
    */
    this.clusterPointElements.changes.subscribe(() => {
      console.log(this.clusterPointElements);
      this.clusterPointElements.forEach((cluster) => {
        console.log(cluster);
        if (cluster.markers.length > 1) {
          this.map.addOverlay(new Overlay({
            position: this.map.getCoordinateFromPixel([cluster.clusterCenter.horizontal, cluster.clusterCenter.vertical]),
            element: cluster.elementRef.nativeElement,
            positioning: 'left-left'}));
        }
       });
    });
    this.positionOverlay = new Overlay({
      position: fromLonLat([18.92182, 47.50685]),
      element: this.positionMarker.elementRef.nativeElement,
      positioning: 'center-center'
    });
    this.map.addOverlay(this.positionOverlay);
    navigator.geolocation.watchPosition((position) => {
      console.log(position.coords);
      // this.map.getView().setCenter(fromLonLat([position.coords.longitude, position.coords.latitude]));
      this.positionOverlay.setPosition(fromLonLat([position.coords.longitude, position.coords.latitude]));
    }, err => console.log(err));
  }

  drawMarkers(reCluster: boolean = false) {
    console.log(reCluster);
    this.map.getOverlays().clear();
    this.clusterPoints = this.getClusters().filter(cluster => cluster.markers.length > 1);
    // TODO: get markers and direction from 1 lengthed clusters draw them from querylist.change
    this.markerOverlays.forEach((marker) => {
      const [x, y] = marker.getPosition();
      console.log(this.map.getPixelFromCoordinate([x, y]));
      if (
        x < this.mapBoundary.north &&
        x > this.mapBoundary.south &&
        y > this.mapBoundary.west &&
        y < this.mapBoundary.east
      ) {
        this.map.addOverlay(marker);
      }
    });
    this.directionOverlays.forEach((direction) => {
      const [x, y] = direction.getPosition();
      if (
        x < this.mapBoundary.north &&
        x > this.mapBoundary.south &&
        y > this.mapBoundary.west &&
        y < this.mapBoundary.east
      ) {
        this.map.addOverlay(direction);
      }
    });
  }

  getClusters() {
    const clusters = [];
    const stepSizeInPixel = 50;
    console.log(this.mapBoundary);
    const [topPx, leftPx] = this.map.getPixelFromCoordinate([this.mapBoundary.north, this.mapBoundary.west]);
    const bottomRight = this.map.getPixelFromCoordinate([this.mapBoundary.south, this.mapBoundary.east]);
    const stepSizeInCoordinates = this.map.getCoordinateFromPixel([stepSizeInPixel, 0])[1] - this.mapBoundary.west;
    console.log(this.mapBoundary.west, stepSizeInCoordinates);

    this.markerOverlays.forEach((marker) => {
      const [horizontalPx, verticalPx] = this.map.getPixelFromCoordinate(marker.getPosition());
      const horizontalIndex = Math.floor(horizontalPx / stepSizeInPixel) * stepSizeInPixel;
      const verticalIndex = Math.floor(verticalPx / stepSizeInPixel) * stepSizeInPixel;
      const existingCluster = clusters.find(
        cluster => cluster.verticalIndex === verticalIndex && cluster.horizontalIndex === horizontalIndex);
      const clusterCenter = {
        horizontal: horizontalIndex + stepSizeInPixel / 2,
        vertical: verticalIndex + stepSizeInPixel / 2
      };
      if (!existingCluster) {
        clusters.push({
          verticalIndex,
          horizontalIndex,
          clusterCenter,
          markers: [ marker ],

        });
      } else {
        existingCluster.markers.push(marker);
      }

    });
    return clusters;
  }

  onMarkerClicked(point: ISpgPpoint) {
    console.log('marker', point, this.markerOverlays);
  }
  // clustering: https://scientificprogrammer.net/2019/08/18/applying-clustering-on-openlayers-map/
}
