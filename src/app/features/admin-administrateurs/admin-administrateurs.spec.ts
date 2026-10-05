import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdministrateurs } from './admin-administrateurs';

describe('AdminAdministrateurs', () => {
  let component: AdminAdministrateurs;
  let fixture: ComponentFixture<AdminAdministrateurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAdministrateurs],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAdministrateurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
