import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISpgMarker } from '../map/map.component';

@Component({
  selector: 'spg-marker-editor',
  templateUrl: './marker-editor.component.html',
  styleUrls: ['./marker-editor.component.less']
})
export class MarkerEditorComponent implements OnInit {

  @Input() markerPoint: ISpgMarker;
  @Input() markerCreateMode: boolean;
  @Output() $markerCreatedModeSwitched = new EventEmitter<Boolean>();
  @Output() $markerUpdated = new EventEmitter<ISpgMarker>();
  @Output() $markerDeleted = new EventEmitter<ISpgMarker>();
  @Output() $quitSelection = new EventEmitter<void>();
  @Output() $zoomToAllMarkers = new EventEmitter<void>();
  @Output() $panToSelected = new EventEmitter<ISpgMarker>();
  @Output() $setMinZoomOnSelected = new EventEmitter<ISpgMarker>();

  constructor() { }

  ngOnInit() {
  }

  toggleCreateMode() {
    this.$markerCreatedModeSwitched.emit(!this.markerCreateMode);
  }

  deleteMarker() {
    this.$markerDeleted.emit(this.markerPoint);
  }

  markerIsUpdated($event) {
      this.$markerUpdated.emit(this.markerPoint);
  }

  quitSelected() {
    this.$quitSelection.emit();
  }
  zoomToAllMarkers() {
    console.log('zoomToAllMarkers');
  }
  panToSelectedMarker() {
    this.$panToSelected.emit(this.markerPoint);
  }
  setCurrentZoomAsMaxVisibleDirection() {
    console.log('setZoom to this marker');
  }

}
