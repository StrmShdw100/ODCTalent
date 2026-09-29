import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifieProfil } from './modifie-profil';

describe('ModifieProfil', () => {
  let component: ModifieProfil;
  let fixture: ComponentFixture<ModifieProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifieProfil],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifieProfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
