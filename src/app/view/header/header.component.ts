import { Aluno } from './../../model/bean_aluno/aluno';
import { AlunoService } from './../../controller/servicos_aluno/aluno.service';
import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/controller/servicos_professor/professor.service';
import { Router } from '@angular/router';
import { AuthService } from './../../controller/servicos_login/auth.service';
import { Professor } from 'src/app/model/bean_professor/professor';
import { Sidenav } from 'materialize-css';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  usuario_nome = "";
  usuario_foto = "";
  //Variavel para mostrar ou nao o menu
  variavel = true;

  constructor(
    private router: Router,
    private loginServico: AuthService,
    private professor_servico: ProfessorService,
    private aluno_servico: AlunoService
  ) { }
  ngOnInit() {

    // Iniciando o SideNav
    var elems = $('.sidenav');
    var instances = Sidenav.init(elems);
  }



  // acaoEsconder() {
  //   this.variavel = false;
  // }

  // acaoMostrar() {
  //   this.variavel = true;
  // }

  deslogar() {
    // console.log("deslogou! local "+localStorage.getItem("usuario_logado"));
    // console.log("deslogou! sessao "+sessionStorage.getItem("usuario_logado"));
    localStorage.removeItem("usuario_logado");
    localStorage.removeItem("professor_logado");
    sessionStorage.removeItem("usuario_logado");
    sessionStorage.removeItem("professor_logado");
    this.usuario_nome = "";
    this.usuario_foto = "";
    this.router.navigate(['/', 'home']);
  }

  usuario_logado() {
    var usuario = sessionStorage.getItem("usuario_logado") != null ? sessionStorage.getItem("usuario_logado") : localStorage.getItem("usuario_logado");
    if (usuario != null) {
      if (this.usuario_nome == "" && this.usuario_foto == "") {
        this.nome_foto_usuario(usuario);
      }
      return true;
    }
    return false;
  }

  usuario_deslogado() {
    var usuario = sessionStorage.getItem("usuario_logado") != null ? sessionStorage.getItem("usuario_logado") : localStorage.getItem("usuario_logado");
    if (usuario != null) {
      return false;
    }
    return true;
  }

  professor_logado() {
    var professor = sessionStorage.getItem("professor_logado") != null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
    if (professor != null) {
      return true;
    }
    return false;
  }

  nome_foto_usuario(email) {
    this.professor_servico.obterDadosProfessor(email).subscribe((professor: Professor) => {
      if (professor == null) {
        this.aluno_servico.obterDadosAluno(email).subscribe((aluno: Aluno) => {
          this.usuario_nome = aluno.nome_aluno;
          this.usuario_foto = aluno.foto_aluno;
        })
      } else {
        this.usuario_nome = professor.nome_professor;
        this.usuario_foto = professor.foto_professor;
      }
    })
  }

  painel_administrativo() {
    if (this.professor_logado()) {
      this.router.navigate(['/', 'administrativo']);
    } else {
      this.router.navigate(['/', 'perfilAluno']);
    }
  }
}