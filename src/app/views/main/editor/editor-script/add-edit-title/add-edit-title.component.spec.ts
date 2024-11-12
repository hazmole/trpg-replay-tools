import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTitleComponent } from './add-edit-title.component';

describe('AddEditTitleComponent', () => {
  let component: AddEditTitleComponent;
  let fixture: ComponentFixture<AddEditTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
