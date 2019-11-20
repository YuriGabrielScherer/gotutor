import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelAdministrativoComponent } from './painel-administrativo.component';

describe('PainelAdministrativoComponent', () => {
  let component: PainelAdministrativoComponent;
  let fixture: ComponentFixture<PainelAdministrativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelAdministrativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
