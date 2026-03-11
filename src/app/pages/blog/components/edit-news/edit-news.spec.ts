import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNews } from './edit-news';

describe('EditNews', () => {
  let component: EditNews;
  let fixture: ComponentFixture<EditNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
