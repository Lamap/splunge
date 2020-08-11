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

export interface ISpgPpoint {
  ltd: number;
  lng: number;
  direction: null | number;
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

  private map: Map;
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
          minZoom: 5,
          maxZoom: 18,
          source: new Static({
            url: 'http://www.fillmurray.com/200/300',
            imageExtent: [19.0472, 47, 19.5, 47.4869],
            projection: 'EPSG:4326'
          })
        })
      ],
      view: new View({
        center: fromLonLat([19.0472, 47.4869]),
        zoom: 15/*,
        projection: 'EPSG:900913'*/
      })
    });

    this.markersList.forEach((marker) => {
      this.map.addOverlay(new Overlay({
        position: fromLonLat([marker.lng, marker.ltd]),
        element: marker.elementRef.nativeElement,
        positioning: 'center-center'
      }));
    });

    // Directions must be on separated layer because should not cover marker signs
    this.markersDirectionsList.forEach((markerDirection) => {
      this.map.addOverlay(new Overlay({
        position: fromLonLat([markerDirection.lng, markerDirection.ltd]),
        element: markerDirection.elementRef.nativeElement,
        positioning: 'center-center'
      }));
    });
  }

  onMarkerClicked(point: ISpgPpoint) {
    console.log('marker', point);
  }
  // clustering: https://scientificprogrammer.net/2019/08/18/applying-clustering-on-openlayers-map/
}
