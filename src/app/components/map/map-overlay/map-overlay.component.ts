import { TweenLite } from 'gsap';
import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';

// TODO: figuring out why not found even if the ./map.component uses the same link
import { LatLngBoundsLiteral } from '../../../../../node_modules/@agm/core/services/google-maps-types';

declare var google: any; // TODO: get proper typing

@Component({
  selector: 'spg-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.less']
})
export class MapOverlayComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) template: ElementRef;

  // TODO: convert to 1 option object
  @Input() bounds: LatLngBoundsLiteral;
  @Input() maxZoomDisplay: number;
  @Input() defaultZoom: number;
  @Input() opacity: number;
  @Input() isDisplayed: boolean;
  @Input() src: string;
  @Input() zIndex: number;
  @Input() id: string;
  @Input() mapTransitionDuration: number;

  private overlayElement: any; // TODO: specify type
  private overlayImage: any; // TODO: specify type

  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this._mapsWrapper.getNativeMap().then(gMap => {
        const overlayView = new google.maps.OverlayView();

        this.overlayElement = this.template.nativeElement.children[0];
        this.overlayImage = this.overlayElement.children[0];

        overlayView.setMap(gMap);
        overlayView.draw = () => {
            const zoomIndex = gMap.getZoom();
            const northWestCoords = new google.maps.LatLng(this.bounds.north, this.bounds.west);
            const southEastCoords = new google.maps.LatLng(this.bounds.south, this.bounds.east);
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

            this.overlayElement.style.opacity = this.isWithinZoomRange(zoomIndex) && this.isDisplayed ?
                this.opacity / 100 : 0;

        };

        overlayView.onAdd = () => {
            const targetPane = overlayView.getPanes().mapPane;
            targetPane.appendChild(this.overlayElement);
        };

        overlayView.getDiv = () => {
            return this.overlayElement;
        };
    });
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.zIndex && this.overlayElement) {
      this.overlayElement.style.zIndex = this.zIndex;
      this.overlayElement.style.opacity = 0;
      this.overlayElement.style.display = 'block';
      TweenLite.to(this.overlayElement, this.mapTransitionDuration / 1000, {opacity: this.opacity / 100});
    }
    if (change.isDisplayed && this.overlayElement) {
        if (!change.isDisplayed.currentValue) {
            this.overlayElement.style.opacity = this.opacity / 100;
            TweenLite.to(this.overlayElement, this.mapTransitionDuration / 1000, {
                opacity: 0,
                onComplete: () => {
                    this.overlayElement.style.display = 'none';
                }
            });
        }
    }

    if (change.opacity && !change.zIndex && !change.isDisplayed && this.overlayElement) {
        TweenLite.to(this.overlayElement, 1, {opacity: this.opacity / 100});
    }
  }

  private isWithinZoomRange(zoomIndex: number): boolean {
      return zoomIndex <= this.maxZoomDisplay;
  }
}
