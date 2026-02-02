import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeam } from './update-team';

describe('UpdateTeam', () => {
  let component: UpdateTeam;
  let fixture: ComponentFixture<UpdateTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTeam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
