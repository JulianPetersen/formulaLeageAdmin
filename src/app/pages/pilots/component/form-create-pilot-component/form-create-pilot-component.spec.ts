import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreatePilotComponent } from './form-create-pilot-component';

describe('FormCreatePilotComponent', () => {
  let component: FormCreatePilotComponent;
  let fixture: ComponentFixture<FormCreatePilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreatePilotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreatePilotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
