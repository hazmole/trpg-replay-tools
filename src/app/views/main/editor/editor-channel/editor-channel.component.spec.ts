import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorChannelComponent } from './editor-channel.component';

describe('EditorChannelComponent', () => {
  let component: EditorChannelComponent;
  let fixture: ComponentFixture<EditorChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
