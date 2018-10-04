import { Component, OnInit, Input } from '@angular/core';
import { ImageCrudService, ImageData } from '../../../services/image-crud.service';
import { ISpgMarker } from '../../map/map/map.component';

@Component({
  selector: 'spg-markerlink-manager',
  templateUrl: './markerlink-manager.component.html',
  styleUrls: ['./markerlink-manager.component.less']
})
export class MarkerlinkManagerComponent implements OnInit {

  @Input() selectedMarker: ISpgMarker;
  @Input() image: ImageData;
  @Input() isSmall: boolean;
  constructor(private imageService: ImageCrudService) { }

  ngOnInit() {
  }

  clear() {
    console.log('clear', this.selectedMarker);
    if (this.image.markerId) {
        this.imageService.removeMarkerFromImageById(this.image.id);
    }
  }

  attach() {
    console.log('attahc', this.selectedMarker);
    if (this.selectedMarker && (!this.image.markerId || this.image.markerId !== this.selectedMarker.id)) {
        this.imageService.addMarkerToImage(this.image, this.selectedMarker);
    }
  }
}
