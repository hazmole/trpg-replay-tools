import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemSelectComponent } from './add-item-select.component';

describe('AddItemSelectComponent', () => {
  let component: AddItemSelectComponent;
  let fixture: ComponentFixture<AddItemSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
