import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrack } from './list-track';

describe('ListTrack', () => {
  let component: ListTrack;
  let fixture: ComponentFixture<ListTrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTrack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTrack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
