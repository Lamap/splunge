import { Component, OnInit } from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';
import { MarkersService } from '../../services/markers.service';

@Component({
  selector: 'spg-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  public markerList: ISpgPoint[] = [];

  constructor(private markerService: MarkersService) { }

  ngOnInit(): void {
    this.markerService.filteredMarkerList$.subscribe(filteredMarkers => {
      console.log(filteredMarkers);
      this.markerList = filteredMarkers;
    });
  }

  mapBoundaryChanged(boundary) {
    this.markerService.setMapBoundary(boundary);
  }

}
