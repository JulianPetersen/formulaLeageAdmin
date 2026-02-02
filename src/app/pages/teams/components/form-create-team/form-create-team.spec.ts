import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateTeam } from './form-create-team';

describe('FormCreateTeam', () => {
  let component: FormCreateTeam;
  let fixture: ComponentFixture<FormCreateTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreateTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreateTeam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
