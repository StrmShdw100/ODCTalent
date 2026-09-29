import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprimerProjet } from './supprimer-projet';

describe('SupprimerProjet', () => {
  let component: SupprimerProjet;
  let fixture: ComponentFixture<SupprimerProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupprimerProjet],
    }).compileComponents();

    fixture = TestBed.createComponent(SupprimerProjet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
