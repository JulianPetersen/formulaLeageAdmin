import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analitica } from './analitica';

describe('Analitica', () => {
  let component: Analitica;
  let fixture: ComponentFixture<Analitica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analitica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analitica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
