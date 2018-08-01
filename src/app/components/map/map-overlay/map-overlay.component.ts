import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';

declare var google: any; // TODO: get proper typing

@Component({
  selector: 'spg-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.less']
})
export class MapOverlayComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) template: ElementRef;

  @Input() north: number;
  @Input() west: number;
  @Input() east: number;
  @Input() south: number;
  @Input() minZoomDisplay: number;
  @Input() maxZoomDisplay: number;
  @Input() defaultZoom: number;
  @Input() opacity: number;

  private overlayElement: any;

  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this._mapsWrapper.getNativeMap().then(gMap => {
        const overlayView = new google.maps.OverlayView();

        this.overlayElement = this.template.nativeElement.children[0];
        console.log(this.overlayElement, gMap);

        overlayView.setMap(gMap);

        overlayView.draw = () => {
            console.log(gMap.getZoom());
            const zoomIndex = gMap.getZoom();
            const northWestCoords = new google.maps.LatLng(this.north, this.west);
            const southEastCoords = new google.maps.LatLng(this.south, this.east);
            const projection = overlayView.getProjection();
            const northWestPixel = projection.fromLatLngToDivPixel(northWestCoords);
            const southEastPixel = projection.fromLatLngToDivPixel(southEastCoords);
            this.overlayElement.style.left = northWestPixel.x + 'px';
            this.overlayElement.style.top = northWestPixel.y + 'px';
            this.overlayElement.style.width = (southEastPixel.x - northWestPixel.x)  + 'px';
            this.overlayElement.style.height = (southEastPixel.y - northWestPixel.y)  + 'px';

            this.overlayElement.style.display = zoomIndex >= this.minZoomDisplay && zoomIndex <= this.maxZoomDisplay ?
                'block' : 'none';

            this.overlayElement.style.opacity = this.opacity / 100;

        };
        overlayView.onAdd = () => {
            overlayView.getPanes().overlayImage.appendChild(this.overlayElement);
        };
        overlayView.getDiv = () => {
            return this.overlayElement;
        };
    });
  }

  ngOnChanges() {}

}
