import { Component, OnInit } from '@angular/core';

// Materialize
import * as M from 'materialize-css';

import { Aluno } from './../../../model/bean_aluno/aluno';
import { AlunoService } from './../../../controller/servicos_aluno/aluno.service';

@Component({
  selector: 'app-perfil-aluno',
  templateUrl: './perfil-aluno.component.html',
  styleUrls: ['./perfil-aluno.component.css']
})
export class PerfilAlunoComponent implements OnInit {

  private aluno: Aluno = new Aluno();

  constructor(
    private alunoService:AlunoService
  ) { }

  ngOnInit() {
    // Primeira acao
    this.primeiraAcao();

    // Chamando o Modal
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  }

  acao() {
    alert('teste')
  }


  // Retornar aluno logado
  private aluno_logado() {
    return localStorage.getItem("usuario_logado") == null ? sessionStorage.getItem("usuario_logado") : localStorage.getItem("professor_logado");
  }

  // Primeira acao da Pagina
  private primeiraAcao() {
    // Retornando o aluno
    this.alunoService.obterDadosAluno(this.aluno_logado())
      .subscribe((resposta)=>{
        this.aluno = resposta;
      });
  }

}
