import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenantEvolution } from './apprenant-evolution';

describe('ApprenantEvolution', () => {
  let component: ApprenantEvolution;
  let fixture: ComponentFixture<ApprenantEvolution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprenantEvolution],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprenantEvolution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
