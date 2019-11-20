import { Professor } from './../../../model/bean_professor/professor';
import { ProfessorService } from './../../../controller/servicos_professor/professor.service';
import { Component, OnInit } from '@angular/core';

import * as M from 'materialize-css';



@Component({
  selector: 'app-painel-administrativo',
  templateUrl: './painel-administrativo.component.html',
  styleUrls: ['./painel-administrativo.component.css']
})
export class PainelAdministrativoComponent implements OnInit {


  // Objeto professor
  private professor: Professor = new Professor();

  // Variaveis
  dataAtual = "30 de Agosto de 2019 - 11:30:00";
  proximaAula = "30/08/2019 - 11:50";
  private nome = this.professor.nome_professor;


  constructor(
    private professorService: ProfessorService
  ) { }

  ngOnInit() {
    this.primeiraAcao();

    //Modal
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);

    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);

    var elems = document.querySelectorAll('.tabs');
    var instances = M.Tabs.init(elems);

  }

  // Metodo para retornar o professor logado
  private professor_logado() {
    return localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
  }

  private primeiraAcao() {

    // Setando o nome do professor Logado
    this.professorService.obterDadosProfessor(this.professor_logado())
      .subscribe((resposta) => {
        setTimeout(() => {
          // Retornando o objeto professor
          this.professor = resposta;
          console.log(this.professor)
        }, 200);
      });

    // Setando a hora atual
    this.RetornaDataHoraAtual();
  }

  // Retornar data e hora atual
  private RetornaDataHoraAtual() {
    var dNow = new Date();
    var localdate = dNow.getDate() + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear();
    // Atribuindo
    this.dataAtual = localdate;
  }

  // Metodo Cancelar a Aula
  private cancelarAula(){
    // Cancelar Aula
    console.log('Cancelar Aula');
  }


}
