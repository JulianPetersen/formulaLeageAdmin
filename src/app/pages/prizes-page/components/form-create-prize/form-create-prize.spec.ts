import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreatePrize } from './form-create-prize';

describe('FormCreatePrize', () => {
  let component: FormCreatePrize;
  let fixture: ComponentFixture<FormCreatePrize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreatePrize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreatePrize);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
