import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/internal/operators';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs/index';
import { ISpgImage, SpgImage } from '../models/spgImage';
import { MapService } from './map.service';

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
  // new system
  public dataFilteredImages$: Observable<ISpgImage[]>;
  public dataFilteredImagesOfBoundary$: Observable<ISpgImage[]>;
  public imagesByMarkers$: Observable<{[id: string]: ISpgImage[]}>;
  public markerLocationsById$ = new BehaviorSubject<{[id: string]: {x: number, y: number}}>(null);
  // --

  public fullImageCollection$: Observable<ISpgImage[]>;
  public filteredImages$ = new BehaviorSubject([]);
  private dateRangeFilter$ = new BehaviorSubject<IDateRangeFilter>(null);
  private tagFilter$ = new BehaviorSubject<ITagFilter>(null);

  constructor(private firestore: AngularFirestore, private mapService: MapService) {
    this.fullImageCollection$ = this.firestore.collection('images')
      .snapshotChanges()
      .pipe(map(actions => actions.map((action) => {
        const data: ISpgImage = action.payload.doc.data() as ISpgImage;
        data.id = action.payload.doc.id;
        return data;
      })));
    this.dataFilteredImages$ = combineLatest([
      this.fullImageCollection$,
      this.dateRangeFilter$,
      this.tagFilter$,
      this.mapService.mapBoundary$
     ]).pipe(map(([images, dateRange, tagFilters]) => {
      const filteredImages = images.filter(image => {
        const dateCondition = dateRange ? image.dated < dateRange.maxYear && image.dated > dateRange.minYear : true;
        const tagCondition = !tagFilters ||
          !Array.isArray(tagFilters.tags) ||
          !Array.isArray(image.tags) ||
          image.tags.some(imageTag => tagFilters.tags.some( tag => tag === imageTag));
        return dateCondition && tagCondition;
      });
      return filteredImages;
    }));
    this.imagesByMarkers$ = this.fullImageCollection$
      .pipe(map((images) => {
        const imagesByMarkers = {};
        images.forEach((image) => {
          if (!imagesByMarkers[image.markerId]) {
            imagesByMarkers[image.markerId] = [image];
          } else {
            imagesByMarkers[image.markerId].push(image);
          }
        });
        return imagesByMarkers;
      }));

    this.dataFilteredImagesOfBoundary$ = combineLatest([this.mapService.mapBoundary$, this.dataFilteredImages$, this.markerLocationsById$])
      .pipe(switchMap(([boundary, images, markerLocations]) => {
        if (!boundary) {
          return of(images);
        }
        if (!markerLocations) {
          return of(images);
        }
        const geofilteredImages = images.filter(image => {
          const location = markerLocations[image.markerId];
          if (!location) {
            return false;
          }
          return location.x < boundary.north && location.x > boundary.south && location.y > boundary.west && location.y < boundary.east;
        });
        return of(geofilteredImages);
      }));

    combineLatest([this.dateRangeFilter$, this.tagFilter$, this.fullImageCollection$])
      .subscribe(([dateRange, tagFilters, allImages]) => {
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

  setMarkerLocationList(value: {[id: string]: {x: number, y: number}}) {
    this.markerLocationsById$.next(value);
  }
}
