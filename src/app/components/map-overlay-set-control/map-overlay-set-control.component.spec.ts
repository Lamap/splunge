import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOverlaySetControlComponent } from './map-overlay-set-control.component';

describe('MapOverlaySetControlComponent', () => {
  let component: MapOverlaySetControlComponent;
  let fixture: ComponentFixture<MapOverlaySetControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOverlaySetControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOverlaySetControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
