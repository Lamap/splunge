import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWidget } from './map.widget';

describe('MapWidget', () => {
  let component: MapWidget;
  let fixture: ComponentFixture<MapWidget>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWidget ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
