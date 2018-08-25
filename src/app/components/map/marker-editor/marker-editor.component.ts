import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ISpgPoint} from '../map/map.component';

@Component({
  selector: 'spg-marker-editor',
  templateUrl: './marker-editor.component.html',
  styleUrls: ['./marker-editor.component.less']
})
export class MarkerEditorComponent implements OnInit {

  @Input() markerPoint: ISpgPoint;
  @Input() markerCreateMode: boolean;
  @Output() $markerCreatedModeSwitched = new EventEmitter<Boolean>();
  @Output() $markerUpdated = new EventEmitter<ISpgPoint>();

  constructor() { }

  ngOnInit() {
  }

  setCreatedMode() {
    console.log('add mode');
    this.$markerCreatedModeSwitched.emit(true);
  }

  deleteMarker() {
    console.log('delete marker');
  }

  markerIsUpdated($event) {
      this.$markerUpdated.emit(this.markerPoint);
  }

}
