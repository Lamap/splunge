import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

interface ImageData {
    url: string;
    originalName: string;
    id?: string;
    title?: string;
    description?: string;
    dated?: number;
}

@Injectable()
export class ImageCrudService {

  public taskProgress = 0;
  private imagesFbsCollection: AngularFirestoreCollection<ImageData>;
  private basePath = '/BTM';

  constructor(store: AngularFirestore) {
    console.log('imageCRUD service');
    this.imagesFbsCollection = store.collection('images');
  }

  upload(file: File) {
      console.log('upload new image', file);
      const storageRef = firebase.storage().ref();
      const fileName = file.name; // TODO: create a hash from the name and some timestamp ???
      const uploadTask = storageRef.child(`${this.basePath}/${fileName}`).put(file);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
snapshot => {
                // in progress
                const snap = snapshot as firebase.storage.UploadTaskSnapshot;
                this.taskProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            },
            error => {
              // error
                console.warn('Image upload failed:', error);
            },
          () => {
              // completed successfully
                console.log(uploadTask.snapshot.downloadURL);
              this.createNewImageData(uploadTask.snapshot.downloadURL, fileName);
            });
  }

  createNewImageData(url: string, originalName): Promise<ImageData> {
      const newItem: ImageData = {
          url: url,
          originalName: originalName
      };
      return this.imagesFbsCollection.add(newItem).then(doc => {
          newItem.id = doc.id;
          return newItem;
      });
  }

}
