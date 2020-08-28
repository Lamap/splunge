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
  public clusterSizeInPixels = 50;
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
    },
    {
      lng: 19.04953,
      ltd: 47.48738,
      direction: 10
    }
  ];
  public zoom: number;
  public clusterPoints: IClusterPoint[] = [];
  public markerPoints: ISpgPpoint[] = [];
  public directionPoints: ISpgPpoint[] = [];

  private map: Map;
  private visiblePoints: ISpgPpoint[] = [];
  private mapBoundary: IMapBoundary;
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
        zoom: 16
      })
    });

    this.map.on('moveend', () => {
      this.mapScreenChanged();
    });
    this.markersList.changes.subscribe(() => {
      this.onMarkerListChanged();
    });
    this.clusterPointElements.changes.subscribe(() => {
      this.onClusterPointsChanged();
    });
    this.markersDirectionsList.changes.subscribe(() => {
      this.onMarkerDirectionsChanged();
    });
  }

  onMarkerClicked(point: ISpgPpoint) {
    console.log('marker', point);
  }

  onClusterClicked(cluster: IClusterPoint) {
    this.map.getView().animate({zoom: this.zoom + 1, center: [cluster.positionX, cluster.positionY]});
  }

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
  onMarkerDirectionsChanged() {
    this.markersDirectionsList.forEach((direction) => {
      const directionOverlay = new Overlay({
        element: direction.elementRef.nativeElement,
        positioning: 'center-center',
        position: [direction.pointData.x, direction.pointData.y],
        stopEvent: false
      });
      this.map.addOverlay(directionOverlay);
    });
  }
  onClusterPointsChanged() {
    this.clusterPointElements.forEach((cluster) => {
      // TODO calculate positions by points avarage
      const clusterOverlay = new Overlay({
        position: [cluster.clusterData.positionX, cluster.clusterData.positionY],
        element: cluster.elementRef.nativeElement,
        positioning: 'bottom-left'
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
    this.markerPoints = JSON.parse(
      JSON.stringify(clusterArray.filter(cluster => cluster.points.length === 1).map(cluster => cluster.points[0]))
    );
    this.clusterPoints = clusterArray.filter(cluster => cluster.points.length > 1);
    this.directionPoints = this.markerPoints.filter(point => point.direction);
  }

  mapZoomChanged() {
    this.clusterSizeInMeters =
      this.map.getCoordinateFromPixel([this.clusterSizeInPixels, 0])[0] - this.map.getCoordinateFromPixel([0, 0 ])[0];
  }

  progressPoints() {
    this.points = this.points.map((point) => {
      const [x, y] = fromLonLat([point.lng, point.ltd]);
      return { ...point, x, y };
    });
  }
}
