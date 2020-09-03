export interface ISpgImage {
  id: string;
  markerId: string;
  /*
  url: string;
  originalName: string;
  dated: number;
  title: string;
  filePath: string;
  author: string;
  description: string;
  */
}

export class SpgImage implements ISpgImage {
  public id: string;
  public markerId: string;
  constructor(rawData: any) {
    //
  }
}
