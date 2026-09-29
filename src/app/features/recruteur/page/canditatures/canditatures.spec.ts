import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canditatures } from './canditatures';

describe('Canditatures', () => {
  let component: Canditatures;
  let fixture: ComponentFixture<Canditatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canditatures],
    }).compileComponents();

    fixture = TestBed.createComponent(Canditatures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
