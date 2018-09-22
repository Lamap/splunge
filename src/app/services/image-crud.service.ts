import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { ISpgMarker } from '../components/map/map/map.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ImageData {
    id?: string;
    url: string;
    originalName: string;
    filePath: string;
    author: string;
    marker?: ISpgMarker;
    markerId?: string;
    title?: string;
    description?: string;
    dated?: number;
}

export interface ImageQuery {
    searchText?: string;
    markerId?: string;
    sort?: {
        by: string;
        desc: boolean;
    };
    timeInterval?: {
      from: number;
      to: number;
    };
    pagination?: {
        pageSize: number;
        pageIndex: number;
    };
    noLocation?: boolean;
}

@Injectable()
export class ImageCrudService {

  public taskProgress = 0;
  public imageListExtended$:  Observable<ImageData[]>;
  public query$ = new BehaviorSubject<ImageQuery | null>({
      sort: {
          by: 'filePath',
          desc: true
      }
  });

  private imagesFbsCollection: AngularFirestoreCollection<ImageData>;
  private basePath = '/BTM';
  private author: string;
  private storageRef;

  constructor(store: AngularFirestore, private auth: AuthService) {

      auth.user$.subscribe(user => {
          this.author = user ? user.email : null;
      });

      this.storageRef = firebase.storage().ref();
      this.imagesFbsCollection = store.collection('images');

      this.imageListExtended$ = this.query$.pipe(switchMap(queryData => {
          console.log('querychanged:::::', queryData);
          return store.collection('images',
              ref => {
                  let query: any = ref; // TODO: solve typescript error when using firebase.firestore.CollectionReference
                  if (!queryData) {
                      return query;
                  }

                  if (queryData.sort) {
                      if (queryData.sort.desc) {
                          query = ref.orderBy(queryData.sort.by, 'desc');
                      } else {
                          query = ref.orderBy(queryData.sort.by);
                      }
                  }

                  // marker
                  if (queryData.markerId) {
                      query = query.where('markerId', '==', queryData.markerId);
                  }

                  // has location
                  if (queryData.noLocation) {
                      query = query.where('markerId', '==', null);
                  }

                  // time range
                  if (queryData.timeInterval) {
                      query = query.where('dated', '>=', queryData.timeInterval.from);
                      query = query.where('dated', '<=', queryData.timeInterval.to);
                  }

                  // pagination
                  if (queryData.pagination) {
                      query = query.limit(queryData.pagination.pageSize);
                      // query = query.startAt(queryData.pagination.pageIndex * queryData.pagination.pageSize);
                  }

                  return query;
              }
          )
          .snapshotChanges().map(
              actions => {
                  return actions.map(action => {
                      const data = action.payload.doc.data() as ImageData;
                      data.id = action.payload.doc.id;
                      return data;
                  });
              }
          ) as Observable<ImageData[]>;
      }));
  }

  upload(file: File, done: Function) {
      console.log('upload new image', file);
      const origFileName = file.name;
      const fileName = 'spg-' + (new Date()).getTime().toString();
      const filePath = `${this.basePath}/${fileName}`;
      const uploadTask = this.storageRef.child(filePath).put(file);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
                // in progress
                const snap = snapshot as firebase.storage.UploadTaskSnapshot;
                this.taskProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                console.log(this.taskProgress + '%');
            },
            error => {
              // error
                console.warn('Image upload failed:', error);
                done();
            },
          () => {
              // completed successfully
              this.createNewImageData(uploadTask.snapshot.downloadURL, origFileName, filePath, done);
            });
  }

  delete(image: ImageData) {
      if (!image.filePath && !image.id) {
          return;
      }
      this.storageRef.child(image.filePath).delete()
          .then(success => {
            this.deleteFromStore(image);
          })
          .catch(error => {
              console.warn('Image delete failed:', error);
          });
  }

  update(image: ImageData) {
      if (!image.id) {
          return;
      }
      this.imagesFbsCollection.doc(image.id).update(image);
  }

  addMarkerToImage(image: ImageData, marker: ISpgMarker) {
      console.log('add image to the selected marker');
      this.imagesFbsCollection.doc(image.id).update({
          marker: marker,
          markerId: marker.id
      });
  }
  removeMarkerFromImage(image: ImageData) {
      console.log('unlink image from the marker');
      this.imagesFbsCollection.doc(image.id).update({
          marker: null,
          markerId: null
      });
  }

  createNewImageData(url: string, originalName: string, filePath: string, done: Function) {
      const newItem: ImageData = {
          url: url,
          filePath: filePath,
          originalName: originalName,
          author: this.author,
          markerId: null
      };
      // TODO: handler error
      this.imagesFbsCollection.add(newItem).then(doc => {
          newItem.id = doc.id;
          done(newItem);
      });
  }

  deleteFromStore(image: ImageData) {
      this.imagesFbsCollection.doc(image.id).delete()
          .then(() => {
              console.log('Image deleted');
          })
          .catch(error => {
              console.warn('Failed to delete: ', error);
          });
  }

}
