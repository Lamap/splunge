import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerEditorComponent } from './marker-editor.component';

describe('MarkerEditorComponent', () => {
  let component: MarkerEditorComponent;
  let fixture: ComponentFixture<MarkerEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
