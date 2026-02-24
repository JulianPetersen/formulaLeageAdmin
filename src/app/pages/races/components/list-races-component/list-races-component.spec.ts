import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRacesComponent } from './list-races-component';

describe('ListRacesComponent', () => {
  let component: ListRacesComponent;
  let fixture: ComponentFixture<ListRacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRacesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
