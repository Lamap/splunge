import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {filter, map, switchMap, take, takeLast, merge} from 'rxjs/internal/operators';
import { ISpgPoint, ISpgPointRawData, SpgPoint } from '../models/spgPoint';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs/index';
import { IMapBoundary, ISpgCoordinates } from '../widgets/osm-map/osm-map.widget';
import { ImageService } from './image.service';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  public fullMarkerList$: Observable<ISpgPoint[]>;

  // TODO: this variable will be replaced by an API call response
  public filteredMarkerList$ = new BehaviorSubject<ISpgPoint[]>([]); // filtered by map boundary, date filter and keyword filter

  private markersCollection: AngularFirestoreCollection<ISpgPoint>;
  private mapBoundaryFilter$ = new BehaviorSubject<IMapBoundary>(null);

  constructor(private firestore: AngularFirestore, private imageService: ImageService) {
    this.markersCollection = firestore.collection('markers');
    this.fullMarkerList$ = this.markersCollection.snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgPoint = action.payload.doc.data() as ISpgPoint;
        data.id = action.payload.doc.id;
        return new SpgPoint(data);
      })));

    // TODO: pipe combinelatest with mergemap into the filtered markers
    // TODO: merge tag filtered and date filtered images into markers
    combineLatest(this.fullMarkerList$, this.mapBoundaryFilter$, this.imageService.fullImageCollection$)
      .subscribe(([markers, boundaries, images]) => {
        console.log('forkJoin:', markers, boundaries);
        if (!boundaries) {
          return this.filteredMarkerList$.next([]);
        }
        const imagesByMarkers = {};
        images.forEach((image) => {
          if (!imagesByMarkers[image.markerId]) {
            imagesByMarkers[image.markerId] = [image.id];
          } else {
            imagesByMarkers[image.markerId].push(image.id);
          }
        });
        const extendedMarkers = markers.map((marker) => {
          marker.images = imagesByMarkers[marker.id] ? imagesByMarkers[marker.id] : [];
          return marker;
        });

        const filteredMarkers = extendedMarkers.filter(
          marker => marker.x < boundaries.north && marker.x > boundaries.south && marker.y > boundaries.west && marker.y < boundaries.east
        );
        this.filteredMarkerList$.next(filteredMarkers);
      });
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
    this.mapBoundaryFilter$.next(boundary);
  }
}
