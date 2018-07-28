import {Input, AfterViewInit, Component, OnInit, ElementRef, ViewChild} from '@angular/core';

import {
    LatLngBounds, LatLng,
    GoogleMapsAPIWrapper
} from '@agm/core';

import { GoogleMap } from '@agm/core/services/google-maps-types';
declare var google: any;

@Component({
  selector: 'spg-map-tiler',
  templateUrl: './map-tiler.component.html',
  styleUrls: ['./map-tiler.component.less']
})
export class MapTilerComponent implements OnInit, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) template: ElementRef;
  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) {}
  private spgSetintervalId: number;

  @Input() north: number;
  @Input() west: number;
  @Input() east: number;
  @Input() south: number;
  @Input() minZoomDisplay: number;
  @Input() maxZoomDisplay: number;

  ngOnInit() {
  }

    ngAfterViewInit() {
        this._mapsWrapper.getNativeMap().then(gMap => {
            const overlayView = new google.maps.OverlayView();

            const element = this.template.nativeElement.children[0];

            overlayView.setMap(gMap);

            overlayView.draw = () => {
              console.log(gMap.getZoom());
              const zoomIndex = gMap.getZoom();
              const northWestCoords = new google.maps.LatLng(this.north, this.west);
              const southEastCoords = new google.maps.LatLng(this.south, this.east);
              const projection = overlayView.getProjection();
              const northWestPixel = projection.fromLatLngToDivPixel(northWestCoords);
              const southEastPixel = projection.fromLatLngToDivPixel(southEastCoords);
              element.style.left = northWestPixel.x + 'px';
              element.style.top = northWestPixel.y + 'px';
              element.style.width = (southEastPixel.x - northWestPixel.x)  + 'px';
              element.style.height = (southEastPixel.y - northWestPixel.y)  + 'px';

              element.style.display = zoomIndex >= this.minZoomDisplay && zoomIndex <= this.maxZoomDisplay ?
                  'block' : 'none';

              element.style.opacity = 0.5;
              clearInterval(this.spgSetintervalId);
              this.spgSetintervalId = window.setInterval(() => {
                element.style.opacity = Number(element.style.opacity) + 0.05;
                if (Number(element.style.opacity) >= 1) {
                    clearInterval(this.spgSetintervalId);
                }
              }, 250);
            };
            overlayView.onAdd = () => {
              overlayView.getPanes().overlayImage.appendChild(element);
            };
            overlayView.getDiv = () => {
              return element;
            };
        });
    }

}
