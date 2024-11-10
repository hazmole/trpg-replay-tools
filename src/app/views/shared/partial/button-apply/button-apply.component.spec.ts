import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonApplyComponent } from './button-apply.component';

describe('ButtonApplyComponent', () => {
  let component: ButtonApplyComponent;
  let fixture: ComponentFixture<ButtonApplyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonApplyComponent]
    });
    fixture = TestBed.createComponent(ButtonApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
