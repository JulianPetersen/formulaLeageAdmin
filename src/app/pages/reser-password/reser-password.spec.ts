import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserPassword } from './reser-password';

describe('ReserPassword', () => {
  let component: ReserPassword;
  let fixture: ComponentFixture<ReserPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
