import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParametres } from './admin-parametres';

describe('AdminParametres', () => {
  let component: AdminParametres;
  let fixture: ComponentFixture<AdminParametres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminParametres],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminParametres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
