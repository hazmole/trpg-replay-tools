import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTalkComponent } from './add-edit-talk.component';

describe('AddEditTalkComponent', () => {
  let component: AddEditTalkComponent;
  let fixture: ComponentFixture<AddEditTalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTalkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
