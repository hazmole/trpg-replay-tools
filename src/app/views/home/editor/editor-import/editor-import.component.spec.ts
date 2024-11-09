import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorImportComponent } from './editor-import.component';

describe('EditorImportComponent', () => {
  let component: EditorImportComponent;
  let fixture: ComponentFixture<EditorImportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorImportComponent]
    });
    fixture = TestBed.createComponent(EditorImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
