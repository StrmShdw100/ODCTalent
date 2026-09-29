import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifieProjet } from './modifie-projet';

describe('ModifieProjet', () => {
  let component: ModifieProjet;
  let fixture: ComponentFixture<ModifieProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifieProjet],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifieProjet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
