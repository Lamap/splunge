import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators';
import { ISpgPoint } from '../models/spgPoint';
import { Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  public markerList$: Observable<ISpgPoint[]>;
  private markersCollection: AngularFirestoreCollection<ISpgPoint>;

  constructor(private firestore: AngularFirestore) {
    this.markersCollection = firestore.collection('markers');
    this.markerList$ = this.markersCollection.snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgPoint = action.payload.doc.data() as ISpgPoint;
        data.id = action.payload.doc.id;
        return data;
      })));
  }

}
