import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscolherCadastroComponent } from './escolher-cadastro.component';

describe('EscolherCadastroComponent', () => {
  let component: EscolherCadastroComponent;
  let fixture: ComponentFixture<EscolherCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscolherCadastroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscolherCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
