import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorWidget } from './editor.widget';

describe('EditorWidget', () => {
  let component: EditorWidget;
  let fixture: ComponentFixture<EditorWidget>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorWidget ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
