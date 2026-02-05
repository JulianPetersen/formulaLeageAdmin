import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPilots } from './list-pilots';

describe('ListPilots', () => {
  let component: ListPilots;
  let fixture: ComponentFixture<ListPilots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPilots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPilots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
