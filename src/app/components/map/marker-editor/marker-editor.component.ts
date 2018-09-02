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

  constructor() { }

  ngOnInit() {
  }

  setCreatedMode() {
    console.log('add mode');
    this.$markerCreatedModeSwitched.emit(true);
  }

  deleteMarker() {
    console.log('delete marker');
    this.$markerDeleted.emit(this.markerPoint);
  }

  markerIsUpdated($event) {
      this.$markerUpdated.emit(this.markerPoint);
  }

}
