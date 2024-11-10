import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorActorComponent } from './editor-actor.component';

describe('EditorActorComponent', () => {
  let component: EditorActorComponent;
  let fixture: ComponentFixture<EditorActorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorActorComponent]
    });
    fixture = TestBed.createComponent(EditorActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
