import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayerComponent } from './base-layer.component';

describe('BaseLayerComponent', () => {
  let component: BaseLayerComponent;
  let fixture: ComponentFixture<BaseLayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseLayerComponent]
    });
    fixture = TestBed.createComponent(BaseLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
