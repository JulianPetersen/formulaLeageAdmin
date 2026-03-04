import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrizes } from './list-prizes';

describe('ListPrizes', () => {
  let component: ListPrizes;
  let fixture: ComponentFixture<ListPrizes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPrizes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPrizes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
