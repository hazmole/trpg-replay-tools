import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumnFrameComponent } from './two-column-frame.component';

describe('TwoColumnFrameComponent', () => {
  let component: TwoColumnFrameComponent;
  let fixture: ComponentFixture<TwoColumnFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoColumnFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoColumnFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
