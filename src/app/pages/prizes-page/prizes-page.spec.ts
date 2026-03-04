import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesPage } from './prizes-page';

describe('PrizesPage', () => {
  let component: PrizesPage;
  let fixture: ComponentFixture<PrizesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
