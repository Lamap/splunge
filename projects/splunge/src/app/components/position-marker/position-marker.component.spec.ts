import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMarkerComponent } from './position-marker.component';

describe('PositionMarkerComponent', () => {
  let component: PositionMarkerComponent;
  let fixture: ComponentFixture<PositionMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
