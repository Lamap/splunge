import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';

@Injectable()
export class ImageCrudService {

  private basePath = '/BTM';

  constructor() {
    console.log('imageCRUD service');
  }

  upload(file: any) {
      console.log('upload new image', file);
      const storageRef = firebase.storage().ref();
      const fileName = 'bela-' + Math.round(Math.random() * 1000000).toString();
      const uploadTask = storageRef.child(`${this.basePath}/${fileName}`).put(file);
  }

}
