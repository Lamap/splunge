import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerlinkManagerComponent } from './markerlink-manager.component';

describe('MarkerlinkManagerComponent', () => {
  let component: MarkerlinkManagerComponent;
  let fixture: ComponentFixture<MarkerlinkManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerlinkManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerlinkManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
