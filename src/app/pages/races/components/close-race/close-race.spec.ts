import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRace } from './close-race';

describe('CloseRace', () => {
  let component: CloseRace;
  let fixture: ComponentFixture<CloseRace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseRace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseRace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
