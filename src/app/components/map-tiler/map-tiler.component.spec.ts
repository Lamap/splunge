import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTilerComponent } from './map-tiler.component';

describe('MapTilerComponent', () => {
  let component: MapTilerComponent;
  let fixture: ComponentFixture<MapTilerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTilerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
