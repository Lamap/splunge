import { TestBed, inject } from '@angular/core/testing';

import { ImageCrudService } from './image-crud.service';

describe('ImageCrudService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageCrudService]
    });
  });

  it('should be created', inject([ImageCrudService], (service: ImageCrudService) => {
    expect(service).toBeTruthy();
  }));
});
