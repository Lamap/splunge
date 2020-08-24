import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterpointComponent } from './clusterpoint.component';

describe('ClusterpointComponent', () => {
  let component: ClusterpointComponent;
  let fixture: ComponentFixture<ClusterpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
