import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/internal/operators';
import { ISpgPoint, SpgPoint } from '../models/spgPoint';
import { BehaviorSubject, Observable, of } from 'rxjs/index';
import { ISpgCoordinates } from '../widgets/osm-map/osm-map.widget';
import { ImageService } from './image.service';
import { combineLatest } from 'rxjs';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  public fullMarkerList$: Observable<ISpgPoint[]>;

  // TODO: this variable will be replaced by an API call response
  public filteredMarkerList$ = new BehaviorSubject<ISpgPoint[]>([]); // filtered by map boundary, date filter and keyword filter
  private markersCollection: AngularFirestoreCollection<ISpgPoint>;

  // New system
  private allMarkers$: Observable<ISpgPoint[]>;
  public markersOfBoundary$: Observable<ISpgPoint[]>;
  public imageFilteredMarkersOfBoundary$: Observable<ISpgPoint[]>;
  public markersExtendedByImages$: Observable<ISpgPoint[]>;
  private markersByIds$ = new BehaviorSubject<{[id: string]: ISpgPoint}>(null);

  constructor(private firestore: AngularFirestore, private imageService: ImageService, private mapService: MapService) {
    this.markersCollection = firestore.collection('markers');
    this.fullMarkerList$ = this.markersCollection.snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgPoint = action.payload.doc.data() as ISpgPoint;
        data.id = action.payload.doc.id;
        return new SpgPoint(data);
      })));

    /// ---------
    this.allMarkers$ = this.markersCollection.snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgPoint = action.payload.doc.data() as ISpgPoint;
        data.id = action.payload.doc.id;
        return new SpgPoint(data);
      })));

    // this will be removed as data services will move behind BE api
    this.markersExtendedByImages$ = combineLatest([this.imageService.imagesByMarkers$, this.allMarkers$])
      .pipe(switchMap(([byMarkers, markers]) => {
        const extendedMarkers = markers.map(marker => {
          marker.images = byMarkers[marker.id] || [];
          return marker;
        });
        return of(extendedMarkers);
      }));

    this.markersExtendedByImages$.subscribe(markers => {
      const markerLocationsById = {};
      const markersById = {};
      markers.forEach(marker => {
        markerLocationsById[marker.id] = {
          x: marker.x,
          y: marker.y
        };
        markersById[marker.id] = marker;
      });
      this.imageService.markerLocationsById$.next(markerLocationsById);
      this.markersByIds$.next(markersById);
    });

    // contains all the markers of the boundary also those that doesnt linked to any image
    this.markersOfBoundary$ = combineLatest([this.markersExtendedByImages$, this.mapService.mapBoundary$])
      .pipe(switchMap(([markers, boundary]) => {
        if (!boundary) {
          return of(markers);
        }
        const markersOnMap = markers.filter(
          marker => marker.x < boundary.north && marker.x > boundary.south && marker.y > boundary.west && marker.y < boundary.east
        );
        return of(markersOnMap);
      }));

    // contains only markers that belongs to some image
    this.imageFilteredMarkersOfBoundary$ = combineLatest([
      this.markersByIds$,
      this.imageService.dataFilteredImagesOfBoundary$,
      this.imageService.imagesByMarkers$]
    )
      .pipe(map(([markersByIds, images, imagesByMarkers]) => {

        if (!images || !markersByIds || !imagesByMarkers) {
          return [];
        }
        const filteredMarkersObject = {};
        images.forEach(image => {
          if (markersByIds[image.markerId] ) {
            filteredMarkersObject[image.markerId] = markersByIds[image.markerId];
          }
        });
        const filteredMarkers = [];
        for (const filteredMarkersObjectKey in filteredMarkersObject) {
          if (filteredMarkersObject.hasOwnProperty(filteredMarkersObjectKey)) {
            // filteredMarkersObject[filteredMarkersObjectKey].images = null;
            filteredMarkers.push(filteredMarkersObject[filteredMarkersObjectKey]);
          }
        }
        return filteredMarkers;
      }));
    // TODO: pipe combinelatest with mergemap into the filtered markers
    // TODO: merge tag filtered and date filtered images into markers
    combineLatest([this.fullMarkerList$, this.mapService.mapBoundary$, this.imageService.fullImageCollection$])
      .subscribe(([markers, boundaries, images]) => {
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
}
