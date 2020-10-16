import { Component, OnInit } from '@angular/core';
import { ISpgPoint } from '../../models/spgPoint';
import { MarkersService } from '../../services/markers.service';

import { IPastMap, IPresentMap } from '../../widgets/map-selector-footer/map-selector-footer.widget';

@Component({
  selector: 'spg-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  public markerList: ISpgPoint[] = [];
  public presentMaps: IPresentMap[] = [
    {
      name: 'Open Street Maps',
      date: 2020
    }
  ];
  public pastMaps: IPastMap[] = [
    {
      name: 'Marek János: Buda sz. kir. város határainak másolati térképe',
      date: 1873,
      opacity: 100,
      src: ''
    },
    {
      name: 'Marek János: Buda sz. kir. város határainak másolati térképe',
      date: 1900,
      opacity: 100,
      src: ''
    },
    {
      name: 'Marek János: Buda sz. kir. város határainak másolati térképe',
      date: 1910,
      opacity: 100,
      src: ''
    },
    {
      name: 'Marek János: Buda sz. kir. város határainak másolati térképe',
      date: 1930,
      opacity: 100,
      src: ''
    }
  ];

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

