import { TestBed, inject } from '@angular/core/testing';

import { MarkerCrudService } from './marker-crud.service';

describe('MarkerCrudService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkerCrudService]
    });
  });

  it('should be created', inject([MarkerCrudService], (service: MarkerCrudService) => {
    expect(service).toBeTruthy();
  }));
});
