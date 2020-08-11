import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerDirectionComponent } from './marker-direction.component';

describe('MarkerDirectionComponent', () => {
  let component: MarkerDirectionComponent;
  let fixture: ComponentFixture<MarkerDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerDirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
