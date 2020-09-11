import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {map, switchMap, take} from 'rxjs/internal/operators';
import { Observable, BehaviorSubject } from 'rxjs/index';
import {ISpgImage, SpgImage} from '../models/spgImage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public queriedImageCollection: Observable<ISpgImage[]>;
  public fullImageCollection: Observable<ISpgImage[]>;
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
    this.fullImageCollection = this.firestore.collection('images')
      .snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgImage = action.payload.doc.data() as ISpgImage;
        data.id = action.payload.doc.id;
        return data;
      })));
  }

  queryByMarkerId(markerId: string) {
    this.markerFilter$.next(markerId);
  }

  updateImage(id: string, updateObject) {
    this.firestore.collection('images').doc(id).update(updateObject);
  }
  removeMarkerFromImages(removalMarkerId: string) {
    this.fullImageCollection
      .pipe(take(1))
      .subscribe((images) => {
        const imagesToUnlink = images.filter(({ markerId }) => markerId === removalMarkerId);
        console.log(imagesToUnlink);
        imagesToUnlink.forEach(({id}) => this.updateImage(id, { markerId: null }));
      });
  }

  deleteImage(image: SpgImage) {
    console.log('delete image');
  }

  addNewImage(file: File) {
    console.log(file);
    const origFileName = file.name;
    const fileName = 'spg-' + (new Date()).getTime().toString();
    // const filePath = `${this.basePath}/${fileName}`;
    // const uploadTask = this.storageRef.child(filePath).put(file);
  }
}
