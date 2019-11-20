import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAlunoNovoComponent } from './cadastro-aluno-novo.component';

describe('CadastroAlunoNovoComponent', () => {
  let component: CadastroAlunoNovoComponent;
  let fixture: ComponentFixture<CadastroAlunoNovoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroAlunoNovoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroAlunoNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
