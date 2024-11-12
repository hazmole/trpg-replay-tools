import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorActorDeleteComponent } from './editor-actor-delete.component';

describe('EditorActorDeleteComponent', () => {
  let component: EditorActorDeleteComponent;
  let fixture: ComponentFixture<EditorActorDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorActorDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorActorDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
