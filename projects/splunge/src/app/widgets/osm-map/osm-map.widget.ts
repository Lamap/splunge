import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

@Component({
  selector: 'spg-osm-map',
  templateUrl: './osm-map.widget.html',
  styleUrls: ['./osm-map.widget.scss']
})
export class OsmMapWidget implements OnInit, AfterViewInit {
  @ViewChild('osmMapContainer', { static: false }) osmMap: ElementRef;

  private map;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.map = new Map({
      target: this.osmMap.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([19.1, 47.5]),
        zoom: 12
      })
    });
  }

}
