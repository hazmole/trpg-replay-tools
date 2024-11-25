import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorChannelDeleteComponent } from './editor-channel-delete.component';

describe('EditorChannelDeleteComponent', () => {
  let component: EditorChannelDeleteComponent;
  let fixture: ComponentFixture<EditorChannelDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorChannelDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorChannelDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
