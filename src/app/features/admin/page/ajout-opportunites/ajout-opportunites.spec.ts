import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutOpportunites } from './ajout-opportunites';

describe('AjoutOpportunites', () => {
  let component: AjoutOpportunites;
  let fixture: ComponentFixture<AjoutOpportunites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutOpportunites],
    }).compileComponents();

    fixture = TestBed.createComponent(AjoutOpportunites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
