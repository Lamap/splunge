import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/internal/operators';
import { Observable, BehaviorSubject } from 'rxjs/index';
import { ISpgImage } from '../models/spgImage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public queriedImageCollection: Observable<ISpgImage[]>;
  private markerFilter$ = new BehaviorSubject<string>('');

  constructor(private firestore: AngularFirestore) {
    this.queriedImageCollection = this.markerFilter$.pipe(switchMap((markerId) => {
      return this.firestore.collection('images', (ref) => {
        return markerId ? ref.where('markerId', '==', markerId) : ref;
      })
        .snapshotChanges()
        .pipe(map(actions => actions.map((action) => {
        const data: ISpgImage = action.payload.doc.data() as ISpgImage;
        data.id = action.payload.doc.id;
        return data;
      })));
    }));
  }

  queryByMarkerId(markerId: string) {
    this.markerFilter$.next(markerId);
  }
}
