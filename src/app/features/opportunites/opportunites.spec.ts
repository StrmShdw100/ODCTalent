import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Opportunites } from './opportunites';

describe('Opportunites', () => {
  let component: Opportunites;
  let fixture: ComponentFixture<Opportunites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Opportunites],
    }).compileComponents();

    fixture = TestBed.createComponent(Opportunites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
