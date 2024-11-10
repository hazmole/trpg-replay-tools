import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelNavBarComponent } from './panel-nav-bar.component';

describe('PanelNavBarComponent', () => {
  let component: PanelNavBarComponent;
  let fixture: ComponentFixture<PanelNavBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelNavBarComponent]
    });
    fixture = TestBed.createComponent(PanelNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
