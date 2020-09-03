import { Component, OnInit } from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';

@Component({
  selector: 'spg-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  public markerList: ISpgPoint[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
