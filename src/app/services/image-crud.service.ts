import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

export interface ImageData {
    url: string;
    originalName: string;
    filePath: string;
    author: string;
    id?: string;
    title?: string;
    description?: string;
    dated?: number;
}

@Injectable()
export class ImageCrudService {

  public taskProgress = 0;
  public imageList$:  Observable<ImageData[]>;
  private imagesFbsCollection: AngularFirestoreCollection<ImageData>;
  private basePath = '/BTM';
  private author: string;
  private storageRef;

  constructor(store: AngularFirestore, private auth: AuthService) {
    console.log('imageCRUD service');
    this.imagesFbsCollection = store.collection('images');
    this.storageRef = firebase.storage().ref();
    auth.user$.subscribe(user => {
       this.author = user ? user.email : null;
    });

    this.imageList$ = this.imagesFbsCollection.snapshotChanges().map(
      actions => {
          return actions.map(action => {
              const data = action.payload.doc.data() as ImageData;
              data.id = action.payload.doc.id;
              return data;
          });
      }
    ) as Observable<ImageData[]>;
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
            },
            error => {
              // error
                console.warn('Image upload failed:', error);
                done();
            },
          () => {
              // completed successfully
              console.log(uploadTask.snapshot.downloadURL);
              this.createNewImageData(uploadTask.snapshot.downloadURL, origFileName, filePath, done);
            });
  }

  delete(image: ImageData) {
      if (!image.filePath && !image.id) {
          return;
      }
      this.storageRef.child(image.filePath).delete()
          .then(success => {
            console.log('image deleted', success);
            this.deleteFromStore(image);
          })
          .catch(error => {
              console.warn('Image delete failed:', error);
          });
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
