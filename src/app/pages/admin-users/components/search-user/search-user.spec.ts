import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUser } from './search-user';

describe('SearchUser', () => {
  let component: SearchUser;
  let fixture: ComponentFixture<SearchUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
