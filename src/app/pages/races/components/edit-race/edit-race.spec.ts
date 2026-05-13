import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRace } from './edit-race';

describe('EditRace', () => {
  let component: EditRace;
  let fixture: ComponentFixture<EditRace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
