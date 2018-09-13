import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadImageComponent } from './head-image.component';

describe('HeadImageComponent', () => {
  let component: HeadImageComponent;
  let fixture: ComponentFixture<HeadImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
