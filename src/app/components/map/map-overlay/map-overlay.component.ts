import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { TweenLite } from 'gsap';

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
  @Input() isDisplayed: boolean;
  @Input() src: string;

  private overlayElement: any; // TODO: specify type
  private overlayImage: any; // TODO: specify type

  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this._mapsWrapper.getNativeMap().then(gMap => {
        const overlayView = new google.maps.OverlayView();

        this.overlayElement = this.template.nativeElement.children[0];
        this.overlayImage = this.overlayElement.children[0];
        console.log(this.overlayElement, this.overlayElement.children[0], gMap);

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

            this.overlayImage.src = this.src;
            this.overlayElement.style.display = this.isWithinZoomRange(zoomIndex) && this.isDisplayed ?
                'block' : 'none';

            this.overlayElement.style.opacity = this.isWithinZoomRange(zoomIndex) && this.isDisplayed ? this.opacity : 0;

        };

        overlayView.onAdd = () => {
            overlayView.getPanes().overlayImage.appendChild(this.overlayElement);
        };

        overlayView.getDiv = () => {
            return this.overlayElement;
        };
    });
  }

  ngOnChanges(change: SimpleChanges) {
    console.log('change', change);
    if (change.isDisplayed && this.overlayElement) {
      console.log(change.isDisplayed);
      change.isDisplayed.currentValue ? this.switchOn() : this.switchOff();
    }
  }

  private switchOn() {
      this.overlayElement.style.display = 'block';
      TweenLite.to(this.overlayElement, 1, {opacity: this.opacity});
  }

  private switchOff() {
      TweenLite.to(this.overlayElement, 1, {opacity: 0, onComplete: () => {
            this.overlayElement.style.display = 'none';
        }
      });
  }

  private isWithinZoomRange(zoomIndex: number): boolean {
      return zoomIndex >= this.minZoomDisplay && zoomIndex <= this.maxZoomDisplay;
  }
}
