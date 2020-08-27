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

export interface ISpgPpoint {
  ltd: number;
  lng: number;
  x?: number;
  y?: number;
  direction?: number;
}
export interface IClusterPoint {
  points: ISpgPpoint[];
  positionX: number;
  positionY: number;
}
export interface IMapBoundary {
  north: number;
  west: number;
  east: number;
  south: number;
}

const clusterSizeInPixels = 50;

@Component({
  selector: 'spg-osm-map',
  templateUrl: './osm-map.widget.html',
  styleUrls: ['./osm-map.widget.scss']
})
export class OsmMapWidget implements OnInit, AfterViewInit {
  @ViewChild('osmMapContainer', { static: false }) osmMap: ElementRef;
  @ViewChildren(MarkerComponent) markersList: QueryList<MarkerComponent>;
  @ViewChildren(MarkerDirectionComponent) markersDirectionsList: QueryList<MarkerDirectionComponent>;
  @ViewChildren(ClusterpointComponent) clusterPointElements: QueryList<ClusterpointComponent>;

  public points: ISpgPpoint[] = [
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
  public zoom: number;
  public clusterPoints: IClusterPoint[] = [];
  public markerPoints: ISpgPpoint[] = [];

  private map: Map;

  private markerOverlays: Overlay[] = [];
  private directionOverlays: Overlay[] = [];
  private mapBoundary: IMapBoundary;

  private visiblePoints = [];
  private clusterSizeInMeters: number;
  constructor() { }

  ngOnInit(): void {
    this.progressPoints();
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
        center: fromLonLat([19.0472, 47.4869]),
        zoom: 16/*,
        projection: 'EPSG:900913'*/
      })
    });
/*
    this.markersList.forEach((marker) => {
      const markerOverlay = new Overlay({
        position: fromLonLat([marker.lng, marker.ltd]),
        element: marker.elementRef.nativeElement,
        positioning: 'center-center'
      });
      this.markerOverlays.push(markerOverlay);
    });
*/
    // Directions must be on separated layer because should not cover marker signs
    this.markersDirectionsList.forEach((markerDirection) => {
      const directionOverlay = new Overlay({
        position: fromLonLat([markerDirection.lng, markerDirection.ltd]),
        element: markerDirection.elementRef.nativeElement,
        positioning: 'center-center',
        stopEvent: false
      });
      this.directionOverlays.push(directionOverlay);
    });

    this.map.on('moveend', () => {
      this.mapScreenChanged();
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
      };
      if (newZoom !== this.zoom) {
        this.zoom = newZoom;
        return this.drawMarkers(true);
      }
      this.drawMarkers();
    });
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
    */
    this.markersList.changes.subscribe(() => {
      this.onMarkerListChanged();
    });
    this.clusterPointElements.changes.subscribe(() => {
      this.onClusterPointsChanged();
    });
  }
/*
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
*/
  onMarkerClicked(point: ISpgPpoint) {
    console.log('marker', point, this.markerOverlays);
  }
  // clustering: https://scientificprogrammer.net/2019/08/18/applying-clustering-on-openlayers-map/

  onMarkerListChanged() {
    this.markersList.forEach((marker) => {
      const markerOverlay = new Overlay({
        position: [marker.pointData.x, marker.pointData.y],
        element: marker.elementRef.nativeElement,
        positioning: 'center-center'
      });
      this.map.addOverlay(markerOverlay);
    });
  }
  onClusterPointsChanged() {
    this.clusterPointElements.forEach((cluster) => {
      console.log('clusterElement', cluster);
      // TODO calculate positions by points avarage
      // const xPostion = cluster.clusterData.points.reduce()
      const clusterOverlay = new Overlay({
        position: [cluster.clusterData.positionX, cluster.clusterData.positionY],
        element: cluster.elementRef.nativeElement,
        positioning: 'left-left'
      });
      this.map.addOverlay(clusterOverlay);
    });
  }
  mapScreenChanged() {
    const clusterCells = {};
    const newZoom = this.map.getView().getZoom();
    const [south, west, north, east] = this.map.getView().calculateExtent();
    this.mapBoundary = {
      north,
      west,
      south,
      east
    };
    this.visiblePoints = this.points.filter(point =>
      point.x < this.mapBoundary.north && point.x > this.mapBoundary.south &&
      point.y > this.mapBoundary.west &&
      point.y < this.mapBoundary.east
    );
    if (newZoom !== this.zoom) {
      this.zoom = newZoom;
      this.mapZoomChanged();
    }
    this.visiblePoints.forEach((point) => {
      const horizontalIndex = Math.floor(point.x / this.clusterSizeInMeters);
      const verticalIndex = Math.floor(point.y / this.clusterSizeInMeters);
      const clusterId = `${horizontalIndex}-${verticalIndex}`;
      if (!clusterCells[clusterId]) {
        clusterCells[clusterId] = {
          points: [point],
          positionX: horizontalIndex * this.clusterSizeInMeters,
          positionY: verticalIndex * this.clusterSizeInMeters,
          verticalIndex,
          horizontalIndex
        };
      } else {
        clusterCells[clusterId].points.push(point);
      }
    });
    this.map.getOverlays().clear();
    const clusterArray: IClusterPoint[] = Object.keys(clusterCells).map(key => clusterCells[key]);
    this.markerPoints = clusterArray.filter(cluster => cluster.points.length === 1).map(cluster => cluster.points[0]);
    this.clusterPoints = clusterArray.filter(cluster => cluster.points.length > 1);
    console.log(this.markerPoints, this.clusterPoints);
  }

  mapZoomChanged() {
    console.log('zoomChanged');
    // TODO: set cluster units
    this.clusterSizeInMeters = this.map.getCoordinateFromPixel([clusterSizeInPixels, 0])[0] - this.map.getCoordinateFromPixel([0, 0 ])[0];
    console.log(this.clusterSizeInMeters);
  }

  progressPoints() {
    this.points = this.points.map((point) => {
      const [x, y] = fromLonLat([point.lng, point.ltd]);
      return { ...point, x, y };
    });
  }
}
