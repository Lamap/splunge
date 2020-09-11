import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter,
  ElementRef, ViewChildren, QueryList, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Map, View } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import Overlay from 'ol/Overlay';
import Static from 'ol/source/ImageStatic';
import { transformExtent } from 'ol/proj';
import { MarkerComponent } from '../../components/marker/marker.component';
import { MarkerDirectionComponent } from '../../components/marker-direction/marker-direction.component';
import { ClusterpointComponent } from '../../components/clusterpoint/clusterpoint.component';
import { ISpgPoint, SpgPoint } from '../../models/spgPoint';

export interface IClusterPoint {
  points: ISpgPoint[];
  positionX: number;
  positionY: number;
  hasPointed?: boolean;
}
export interface IMapBoundary {
  north: number;
  west: number;
  east: number;
  south: number;
}
export interface ILatLongCoordinate {
  lng: number;
  ltd: number;
}
@Component({
  selector: 'spg-osm-map',
  templateUrl: './osm-map.widget.html',
  styleUrls: ['./osm-map.widget.scss']
})
export class OsmMapWidget implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('osmMapContainer', { static: false }) osmMap: ElementRef;
  @ViewChildren(MarkerComponent) markersList: QueryList<MarkerComponent>;
  @ViewChildren(MarkerDirectionComponent) markersDirectionsList: QueryList<MarkerDirectionComponent>;
  @ViewChildren(ClusterpointComponent) clusterPointElements: QueryList<ClusterpointComponent>;

  @Input() markers: ISpgPoint[];
  @Input() draggableMarkers = true;
  @Input() cursorType: string;
  @Input() pointedMap: SpgPoint;
  @Output() markerClicked = new EventEmitter<ISpgPoint>();
  @Output() markerRepositioned = new EventEmitter<ISpgPoint>();
  @Output() mapClicked = new EventEmitter<ILatLongCoordinate>();

  public clusterSizeInPixels = 80;
  public zoom: number;
  public clusterPoints: IClusterPoint[] = [];
  public markerPoints: ISpgPoint[] = [];
  public directionPoints: ISpgPoint[] = [];

  private map: Map;
  private visiblePoints: ISpgPoint[] = [];
  private mapBoundary: IMapBoundary;
  private clusterSizeInMeters: number;

  private markerOverlays: any = {};

  constructor() { }

  ngOnInit(): void {
    console.log('ngOnInit - this.markers:', this.markers);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.markers && changes.markers.firstChange) {
      return;
    }
    // TODO: filter for the only changed overlays
    this.drawMarkers();
  }

  ngAfterViewInit() {
    console.log('ngOnInit - this.markers:', this.markers);
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
      this.drawMarkers();
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
    this.map.on('click', (event) => {
      const [mapX, mapY] = event.coordinate;
      const [lng, ltd] = toLonLat([mapX, mapY]);
      this.mapClicked.emit({
        ltd,
        lng
      });
    });
  }

  onMarkerClicked(point: ISpgPoint) {
    this.markerClicked.emit(point);
    console.log(point);
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
      this.markerOverlays[marker.pointData.id] = markerOverlay;
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
  drawMarkers() {
    const clusterCells = {};
    const newZoom = this.map.getView().getZoom();
    const [south, west, north, east] = this.map.getView().calculateExtent();
    this.mapBoundary = {
      north,
      west,
      south,
      east
    };
    this.visiblePoints = this.markers.filter(point =>
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
          horizontalIndex,
          hasPointed: point.isPointed
        };
      } else {
        clusterCells[clusterId].points.push(point);
        clusterCells[clusterId].hasPointed = point.isPointed ? true : clusterCells[clusterId].hasPointed;
      }
    });
    this.map.getOverlays().clear();
    const clusterArray: IClusterPoint[] = Object.keys(clusterCells).map(key => clusterCells[key]);
    this.markerPoints = JSON.parse(
      JSON.stringify(clusterArray.filter(cluster => cluster.points.length === 1).map(cluster => cluster.points[0]))
    );
    this.clusterPoints = clusterArray.filter(cluster => cluster.points.length > 1);
    this.directionPoints = this.markerPoints.filter(point => point.hasDirection);
  }

  mapZoomChanged() {
    // Cannot read property '0' of null
    const nullPoint = this.map.getCoordinateFromPixel([0, 0]);
    const clusterDistance = this.map.getCoordinateFromPixel([this.clusterSizeInPixels, 0]);
    console.log('mapZoomChanged', this.map, nullPoint, clusterDistance);
    if (!nullPoint || !clusterDistance) {
      return;
    }
    this.clusterSizeInMeters = clusterDistance[0] - nullPoint[0];
  }

  markerDropped($event: any, point: ISpgPoint) {
    const [coordNullX, coordNullY] = this.map.getCoordinateFromPixel([0, 0]);
    const [coordDiffX, coordDiffY] = this.map.getCoordinateFromPixel([$event.distance.x, $event.distance.y]);
    const newXCoord = point.x + coordDiffX - coordNullX;
    const newYCoord = point.y + coordDiffY - coordNullY;
    this.markerOverlays[point.id].setPosition([newXCoord, newYCoord]);
    const [newLng, newLtd] = toLonLat([newXCoord, newYCoord]);
    console.log(newLng, newXCoord);
    point.ltd = newLtd;
    point.lng = newLng;
    this.markerRepositioned.emit(point);
  }

  centerMarker(point: SpgPoint) {
    this.map.getView().animate({center: [point.x, point.y]});
  }
}
