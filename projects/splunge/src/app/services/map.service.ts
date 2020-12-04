import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pastMaps } from './pastMaps';
import { presentMaps } from './presentMaps';

export interface IDisplayZoomRange {
  min: number;
  max: number;
}
export interface IMapBoundary {
  north: number;
  east: number;
  south: number;
  west: number;
}
export interface IPresentMap {
  id: number;
  name: string;
  date: number;
}
export interface IPastMap {
  id: number;
  name: string;
  date: number;
  opacity: number;
  src: string;
  selected?: boolean;
  displayZoomRange: IDisplayZoomRange;
  extentInLngLat: IMapBoundary;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public mapBoundary$ = new BehaviorSubject<IMapBoundary>(null);
  public pastMaps$ = new BehaviorSubject<IPastMap[]>(pastMaps);
  public presentMaps$ = new BehaviorSubject<IPresentMap[]>(presentMaps);
  constructor() { }
  setMapBoundary(boundary: IMapBoundary) {
    this.mapBoundary$.next(boundary);
  }
}
