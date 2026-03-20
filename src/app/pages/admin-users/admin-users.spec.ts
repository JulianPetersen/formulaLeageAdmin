import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUSers } from './admin-users';

describe('AdminUSers', () => {
  let component: AdminUSers;
  let fixture: ComponentFixture<AdminUSers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUSers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUSers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
