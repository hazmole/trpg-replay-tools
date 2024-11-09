import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelNavButtonComponent } from './panel-nav-button.component';

describe('NavButtonComponent', () => {
  let component: PanelNavButtonComponent;
  let fixture: ComponentFixture<PanelNavButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelNavButtonComponent]
    });
    fixture = TestBed.createComponent(PanelNavButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
