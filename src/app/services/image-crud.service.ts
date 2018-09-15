import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { switchMap } from 'rxjs/operators';
import { ISpgMarker } from '../components/map/map/map.component';

export interface ImageData {
    url: string;
    originalName: string;
    filePath: string;
    author: string;
    marker?: string;
    id?: string;
    title?: string;
    description?: string;
    dated?: number;
}

export interface ImageQuery {
    sortDesc: Boolean;
    searchText: String;
}

@Injectable()
export class ImageCrudService {

  public taskProgress = 0;
  public imageList$:  Observable<ImageData[]>;
  public query$ = new Subject<ImageQuery>();

  private imagesFbsCollection: AngularFirestoreCollection<ImageData>;
  private basePath = '/BTM';
  private author: string;
  private storageRef;

  constructor(store: AngularFirestore, private auth: AuthService) {

        auth.user$.subscribe(user => {
          this.author = user ? user.email : null;
        });

        this.imagesFbsCollection = store.collection('images',
            ref => ref.orderBy('filePath', 'desc'));
        this.storageRef = firebase.storage().ref();
        this.imageList$ = this.imagesFbsCollection.snapshotChanges().map(
            actions => {
              return actions.map(action => {
                  const data = action.payload.doc.data() as ImageData;
                  data.id = action.payload.doc.id;
                  return data;
              });
            }
        ) as Observable<ImageData[]>;

      /*
    this.query$.pipe(
        switchMap( query => {
            console.log('query', query);
        })
    );
    */
    this.query$.subscribe(query => {
        console.log('queryChanged', query);

        this.imagesFbsCollection = store.collection('images',
            ref => {
                    let fbQuery: any = ref;
                    if (query.sortDesc) {
                        fbQuery.orderBy('filePath', 'desc');
                    } else {
                        fbQuery.orderBy('filePath');
                    }
                    if (query.searchText) {
                        fbQuery = fbQuery.where('title', '==', query.searchText);
                    };
                    return fbQuery;
                }
            );
    });
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

  addImageToMarker(image: ImageData, marker: ISpgMarker) {
      console.log('add image to the selected marker');
      this.imagesFbsCollection.doc(image.id).update({marker: marker.id});
  }
  removeImageFromMarker(image: ImageData) {
      console.log('unlink image from the marker');
      this.imagesFbsCollection.doc(image.id).update({marker: null});
  }

  createNewImageData(url: string, originalName: string, filePath: string, done: Function) {
      const newItem: ImageData = {
          url: url,
          filePath: filePath,
          originalName: originalName,
          author: this.author
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
