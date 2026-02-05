import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrack } from './create-track';

describe('CreateTrack', () => {
  let component: CreateTrack;
  let fixture: ComponentFixture<CreateTrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
