import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ISpgCoords, ISpgMarker } from '../components/map/map/map.component'; // TODO: this should be in the service

@Injectable()
export class MarkerCrudService {

  private markerFbsCollection: AngularFirestoreCollection<ISpgMarker>;
  public markers$: Observable<ISpgMarker[]>;

  constructor(store: AngularFirestore) {
    console.log('markerService created');
    this.markerFbsCollection = store.collection('markers'/*,
                ref => {
                  let query = ref;
                  query = query.where('coords.latitude', '>', 47);
                  query = query.where('coords.latitude', '<', 49);
                  query = query.where('coords.longitude', '>', 19);
                  query = query.where('coords.longitude', '<', 20);
                  return query;
                }*/);

    this.markerFbsCollection.ref.get().then(function(collection) {
        console.log('collection:', collection.size);
    }).catch(function(error) {
        console.log('Error getting collection:', error);
    });

    this.markers$ = this.markerFbsCollection.snapshotChanges().map(
        actions => {
            return actions.map(action => {
                const data = action.payload.doc.data() as ISpgMarker;
                data.id = action.payload.doc.id;
                return data;
            });
            /*.filter(data => {
              return (
                  data.coords.latitude > 47 &&
                  data.coords.latitude < 49 &&
                  data.coords.longitude > 19 &&
                  data.coords.longitude < 20
              );
            });
            */
        }
    ) as Observable<ISpgMarker[]>;
  }

  getMarkerStream() {
    //
  }

  addMarker(coords: ISpgCoords): Promise<ISpgMarker> {
      const newMarker: ISpgMarker = {
          coords: coords,
          hasDirection: false,
          direction: 0
      };

      return this.markerFbsCollection.add(newMarker).then(doc => {
          newMarker.id = doc.id;
          return newMarker;
      });
  }

  deleteMarker(markerData: ISpgMarker): Promise<void> {
    if (!markerData.id) {
      return;
    }
    return this.markerFbsCollection.doc(markerData.id).delete();
  }

  updateMarker(markerData: ISpgMarker) {
    if (!markerData.id) {
      return;
    }
    this.markerFbsCollection.doc(markerData.id).update({
        hasDirection: markerData.hasDirection,
        direction: markerData.direction,
        coords: markerData.coords
    });
  }
}
