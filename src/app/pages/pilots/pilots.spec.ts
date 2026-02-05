import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pilots } from './pilots';

describe('Pilots', () => {
  let component: Pilots;
  let fixture: ComponentFixture<Pilots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pilots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pilots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
