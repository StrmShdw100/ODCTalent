import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MettreEnJourPortfolio } from './mettre-en-jour-portfolio';

describe('MettreEnJourPortfolio', () => {
  let component: MettreEnJourPortfolio;
  let fixture: ComponentFixture<MettreEnJourPortfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MettreEnJourPortfolio],
    }).compileComponents();

    fixture = TestBed.createComponent(MettreEnJourPortfolio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
