import { TestBed, inject } from '@angular/core/testing';

import { SymbolFactoryService } from './symbol-factory.service';

describe('SymbolFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SymbolFactoryService]
    });
  });

  it('should be created', inject([SymbolFactoryService], (service: SymbolFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
