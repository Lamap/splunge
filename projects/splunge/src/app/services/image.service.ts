import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/internal/operators';
import {Observable, BehaviorSubject, combineLatest} from 'rxjs/index';
import { ISpgImage, SpgImage } from '../models/spgImage';

export interface IDateRangeFilter {
  minYear: number;
  maxYear: number;
}

export interface ITagFilter {
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public fullImageCollection$: Observable<ISpgImage[]>;
  public filteredImages$ = new BehaviorSubject([]);
  private dateRangeFilter$ = new BehaviorSubject<IDateRangeFilter>(null);
  private tagFilter$ = new BehaviorSubject<ITagFilter>(null);

  constructor(private firestore: AngularFirestore) {
    this.fullImageCollection$ = this.firestore.collection('images')
      .snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgImage = action.payload.doc.data() as ISpgImage;
        data.id = action.payload.doc.id;
        return data;
      })));

    combineLatest(this.dateRangeFilter$, this.tagFilter$, this.fullImageCollection$).subscribe(([dateRange, tagFilters, allImages]) => {
      if (!allImages) {
        return this.filteredImages$.next([]);
      }
      const images = allImages.filter(image => {
        let pass: boolean;
        if (dateRange) {
          pass = image.dated > dateRange.minYear && image.dated < dateRange.maxYear;
        }
        if (tagFilters && tagFilters.tags && tagFilters.tags.length) {
          tagFilters.tags.forEach((tag) => image.tags.find(imageTag => imageTag === tag));
        }
      });
      this.filteredImages$.next(images);
    });
  }

  updateImage(id: string, updateObject) {
    this.firestore.collection('images').doc(id).update(updateObject);
  }
  removeMarkerFromImages(removalMarkerId: string) {
    this.fullImageCollection$
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
