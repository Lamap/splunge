import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsmMapWidget } from './osm-map.widget';

describe('OsmMapWidget', () => {
  let component: OsmMapWidget;
  let fixture: ComponentFixture<OsmMapWidget>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsmMapWidget ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsmMapWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
