import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as mapConfig from '../../../config/gmConfig.json';

@Component({
  selector: 'spg-map',
  templateUrl: './map.widget.html',
  styleUrls: ['./map.widget.scss']
})
export class MapWidget implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  public map: google.maps.Map;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.map = new google.maps.Map(this.gmap.nativeElement, {
      zoom: 8,
      center: new google.maps.LatLng(47, 19),
      styles: mapConfig.styles
    });
  }

}
