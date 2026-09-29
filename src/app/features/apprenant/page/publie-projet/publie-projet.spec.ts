import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublieProjet } from './publie-projet';

describe('PublieProjet', () => {
  let component: PublieProjet;
  let fixture: ComponentFixture<PublieProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublieProjet],
    }).compileComponents();

    fixture = TestBed.createComponent(PublieProjet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
