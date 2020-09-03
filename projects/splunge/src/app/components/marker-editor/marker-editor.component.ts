import { Component, OnInit, Input } from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';

@Component({
  selector: 'spg-marker-editor',
  templateUrl: './marker-editor.component.html',
  styleUrls: ['./marker-editor.component.scss']
})
export class MarkerEditorComponent implements OnInit {
  @Input() point: ISpgPoint;
  constructor() { }

  ngOnInit(): void {
  }

}
