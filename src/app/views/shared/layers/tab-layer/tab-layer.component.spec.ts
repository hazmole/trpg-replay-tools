import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabLayerComponent } from './tab-layer.component';

describe('TabLayerComponent', () => {
  let component: TabLayerComponent;
  let fixture: ComponentFixture<TabLayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabLayerComponent]
    });
    fixture = TestBed.createComponent(TabLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
