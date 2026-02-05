import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePilotComponent } from './update-pilot-component';

describe('UpdatePilotComponent', () => {
  let component: UpdatePilotComponent;
  let fixture: ComponentFixture<UpdatePilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePilotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePilotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
