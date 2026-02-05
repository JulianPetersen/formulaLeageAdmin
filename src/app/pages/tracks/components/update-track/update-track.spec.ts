import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTrack } from './update-track';

describe('UpdateTrack', () => {
  let component: UpdateTrack;
  let fixture: ComponentFixture<UpdateTrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTrack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTrack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
