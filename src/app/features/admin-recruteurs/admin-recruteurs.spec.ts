import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecruteurs } from './admin-recruteurs';

describe('AdminRecruteurs', () => {
  let component: AdminRecruteurs;
  let fixture: ComponentFixture<AdminRecruteurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecruteurs],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRecruteurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
