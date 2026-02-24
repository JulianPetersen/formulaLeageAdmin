import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRace } from './create-race';

describe('CreateRace', () => {
  let component: CreateRace;
  let fixture: ComponentFixture<CreateRace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
