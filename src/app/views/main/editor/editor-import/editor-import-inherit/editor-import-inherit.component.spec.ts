import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorImportInheritComponent } from './editor-import-inherit.component';

describe('EditorImportInheritComponent', () => {
  let component: EditorImportInheritComponent;
  let fixture: ComponentFixture<EditorImportInheritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorImportInheritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorImportInheritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
