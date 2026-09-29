import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ajoutactualite } from './ajoutactualite';

describe('Ajoutactualite', () => {
  let component: Ajoutactualite;
  let fixture: ComponentFixture<Ajoutactualite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ajoutactualite],
    }).compileComponents();

    fixture = TestBed.createComponent(Ajoutactualite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
