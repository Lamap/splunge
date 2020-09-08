import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';

@Component({
  selector: 'spg-marker-editor',
  templateUrl: './marker-editor.component.html',
  styleUrls: ['./marker-editor.component.scss']
})
export class MarkerEditorComponent implements OnInit {
  @Input() point: ISpgPoint;
  @Output() pointDeselected$ = new EventEmitter<void>();
  @Output() deleteSelected$ = new EventEmitter<ISpgPoint>();
  @Output() pointChanged$ = new EventEmitter<ISpgPoint>();
  constructor() { }

  ngOnInit(): void {
  }
  deselect() {
    this.pointDeselected$.emit();
  }
  delete() {
    this.deleteSelected$.emit(this.point);
  }
  pointChanged() {
    this.pointChanged$.emit(this.point);
  }
}
