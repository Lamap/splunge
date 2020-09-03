import { fromLonLat } from 'ol/proj';

export interface ISpgPoint {
  id: string;
  ltd: number;
  lng: number;
  x?: number;
  y?: number;
  direction?: number;
  hasDirection: boolean;
  isSelected?: boolean;
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
    this.direction = rawData.direction;
    this.hasDirection = rawData.hasDirection;
    this.x = x;
    this.y = y;
  }
}
