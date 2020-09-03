import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';

@Component({
  selector: 'spg-editor',
  templateUrl: './editor.widget.html',
  styleUrls: ['./editor.widget.scss']
})
export class EditorWidget implements OnInit {
  public imageList = [];
  constructor() {
  }

  ngOnInit(): void {

  }

}
