import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOverlaySetComponent } from './map-overlay-set.component';

describe('MapOverlaySetComponent', () => {
  let component: MapOverlaySetComponent;
  let fixture: ComponentFixture<MapOverlaySetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOverlaySetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOverlaySetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
