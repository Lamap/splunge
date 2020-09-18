import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {filter, map, switchMap, take, takeLast} from 'rxjs/internal/operators';
import { ISpgPoint, ISpgPointRawData, SpgPoint } from '../models/spgPoint';
import { BehaviorSubject, Observable, of} from 'rxjs/index';
import { IMapBoundary, ISpgCoordinates } from '../widgets/osm-map/osm-map.widget';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  public fullMarkerList$: Observable<ISpgPoint[]>;
  public filteredMarkerList$: Observable<ISpgPoint[]>; // filtered by map boundary, date filter and keyword filter
  private markersCollection: AngularFirestoreCollection<ISpgPoint>;
  private mapBoundaryFilter = new BehaviorSubject<IMapBoundary>(null);

  constructor(private firestore: AngularFirestore, private imageService: ImageService) {
    this.markersCollection = firestore.collection('markers');
    this.fullMarkerList$ = this.markersCollection.snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgPoint = action.payload.doc.data() as ISpgPoint;
        data.id = action.payload.doc.id;
        return new SpgPoint(data);
      })));

    this.filteredMarkerList$ = this.mapBoundaryFilter.pipe(switchMap(
      (boundary) => {
        console.log(boundary);
        if (!boundary) {
          return of([]);
        }
        return this.fullMarkerList$.pipe(
          map(markers => markers.filter(
            marker => marker.x < boundary.north && marker.x > boundary.south && marker.y > boundary.west && marker.y < boundary.east)
          ));
      }
    ));
  }
  updateMarker(point: SpgPoint) {
    const rawPointData = SpgPoint.getRawData(point);
    this.markersCollection.doc(point.id).update(rawPointData);
  }
  createMarker(coords: ISpgCoordinates) {
    const newPoint: any = {
      coords: {
        latitude: coords.ltd,
        longitude: coords.lng,
        x: coords.x,
        y: coords.y
      },
      direction: 0,
      hasDirection: false
    };
    this.markersCollection.add(newPoint as ISpgPoint);
  }

  deleteMarker(point: SpgPoint) {
    this.markersCollection.doc(point.id).delete();
    this.imageService.removeMarkerFromImages(point.id);
  }
  setMapBoundary(boundary: IMapBoundary) {
    this.mapBoundaryFilter.next(boundary);
  }
}
