import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take } from 'rxjs/internal/operators';
import { ISpgPoint, ISpgPointRawData, SpgPoint } from '../models/spgPoint';
import { Observable } from 'rxjs/index';
import { ILatLongCoordinate } from '../widgets/osm-map/osm-map.widget';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  public markerList$: Observable<ISpgPoint[]>;
  private markersCollection: AngularFirestoreCollection<ISpgPoint>;

  constructor(private firestore: AngularFirestore, private imageService: ImageService) {
    this.markersCollection = firestore.collection('markers');
    this.markerList$ = this.markersCollection.snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgPoint = action.payload.doc.data() as ISpgPoint;
        data.id = action.payload.doc.id;
        return data;
      })));
  }
  updateMarker(point: SpgPoint) {
    const rawPointData = SpgPoint.getRawData(point);
    this.markersCollection.doc(point.id).update(rawPointData);
  }
  createMarker(coords: ILatLongCoordinate) {
    const newPoint: any = {
      coords: {
        latitude: coords.ltd,
        longitude: coords.lng
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
