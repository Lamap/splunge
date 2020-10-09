import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSelectorFooterWidget } from './map-selector-footer.widget';

describe('MapSelectorFooterWidget', () => {
  let component: MapSelectorFooterWidget;
  let fixture: ComponentFixture<MapSelectorFooterWidget>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSelectorFooterWidget ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSelectorFooterWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
