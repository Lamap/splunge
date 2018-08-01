import {Input, AfterViewInit, Component, OnInit, ElementRef, ViewChild, OnChanges} from '@angular/core';

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
export class MapTilerComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) template: ElementRef;
  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) {}
  private element: any;

  @Input() north: number;
  @Input() west: number;
  @Input() east: number;
  @Input() south: number;
  @Input() minZoomDisplay: number;
  @Input() maxZoomDisplay: number;
  @Input() defaultZoom: number;
  @Input() opacity: number;

  ngOnInit() {
  }

    ngAfterViewInit() {
        this._mapsWrapper.getNativeMap().then(gMap => {
            const overlayView = new google.maps.OverlayView();

            this.element = this.template.nativeElement.children[0];

            overlayView.setMap(gMap);

            overlayView.draw = () => {
              console.log(gMap.getZoom());
              const zoomIndex = gMap.getZoom();
              const northWestCoords = new google.maps.LatLng(this.north, this.west);
              const southEastCoords = new google.maps.LatLng(this.south, this.east);
              const projection = overlayView.getProjection();
              const northWestPixel = projection.fromLatLngToDivPixel(northWestCoords);
              const southEastPixel = projection.fromLatLngToDivPixel(southEastCoords);
                this.element.style.left = northWestPixel.x + 'px';
                this.element.style.top = northWestPixel.y + 'px';
                this.element.style.width = (southEastPixel.x - northWestPixel.x)  + 'px';
                this.element.style.height = (southEastPixel.y - northWestPixel.y)  + 'px';

                this.element.style.display = zoomIndex >= this.minZoomDisplay && zoomIndex <= this.maxZoomDisplay ?
                  'block' : 'none';

                this.element.style.opacity = this.opacity / 100;

            };
            overlayView.onAdd = () => {
              overlayView.getPanes().overlayImage.appendChild(this.element);
            };
            overlayView.getDiv = () => {
              return this.element;
            };
        });
    }
    ngOnChanges(change) {
      console.log(change);
      if (this.element) {
          this.element.style.opacity = change.opacity.currentValue / 100;
      }
    }
}
