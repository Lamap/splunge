export interface ISpgImage {
  id: string;
  markerId: string;
  url: string;
  originalName?: string;
  dated?: number;
  title: string;
  filePath: string;
  author: string;
  description: string;
  tags?: string[];
}

export class SpgImage implements ISpgImage {
  public id: string;
  public markerId: string;
  public url: string;
  public dated?: number;
  public title: string;
  public filePath: string;
  public author: string;
  public description: string;
  public tags: string[];

  constructor(rawData: any) {
    this.id = rawData.id;
    this.markerId = rawData.markerId;
    this.url = rawData.url;
    this.dated = rawData.dated;
    this.filePath = rawData.filePath;
    this.title = rawData.title;
    this.author = rawData.author;
    this.description = rawData.description;
    this.tags = rawData.tags;
  }
}
