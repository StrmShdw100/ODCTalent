import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inscrption } from './inscrption';

describe('Inscrption', () => {
  let component: Inscrption;
  let fixture: ComponentFixture<Inscrption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inscrption],
    }).compileComponents();

    fixture = TestBed.createComponent(Inscrption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
