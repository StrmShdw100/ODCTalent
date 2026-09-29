import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationsDeProjet } from './moderations_de_projet';

describe('ModerationsDeProjet', () => {
  let component: ModerationsDeProjet;
  let fixture: ComponentFixture<ModerationsDeProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationsDeProjet],
    }).compileComponents();

    fixture = TestBed.createComponent(ModerationsDeProjet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
