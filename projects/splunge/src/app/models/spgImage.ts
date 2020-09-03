export interface ISpgImage {
  id: string;
  /*
  url: string;
  originalName: string;
  dated: number;
  title: string;
  markerId: string;
  filePath: string;
  author: string;
  description: string;
  */
}

export class SpgImage implements ISpgImage {
  public id: string;
  constructor(rawData: any) {
    //
  }
}
