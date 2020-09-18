import { fromLonLat } from 'ol/proj';
import { ISpgImage } from './spgImage';

export interface ISpgPoint {
  id: string;
  ltd: number;
  lng: number;
  x?: number;
  y?: number;
  direction?: number;
  hasDirection: boolean;
  isSelected?: boolean;
  isPointed?: boolean;
  images?: ISpgImage[];
}

export interface ISpgPointRawData {
  coords: {
    latitude: number;
    longitude: number;
    x: number;
    y: number;
  };
  direction: number;
  hasDirection: boolean;
}

export class SpgPoint implements ISpgPoint {
  public id: string;
  public ltd: number;
  public lng: number;
  public x: number;
  public y: number;
  public direction: number;
  public hasDirection: boolean;
  public isSelected = false;
  constructor(rawData: any) {
    const [x, y] = fromLonLat([rawData.coords.longitude, rawData.coords.latitude]);
    this.id = rawData.id;
    this.ltd = rawData.coords.latitude;
    this.lng = rawData.coords.longitude;
    this.direction = rawData.direction || 0;
    this.hasDirection = rawData.hasDirection || false;
    this.x = x;
    this.y = y;
  }

  static getRawData(point: SpgPoint): ISpgPointRawData {
    return {
      coords: {
        latitude: point.ltd,
        longitude: point.lng,
        x: point.x,
        y: point.y
      },
      direction: point.direction,
      hasDirection: point.hasDirection
    };
  }
}
