import { Aluno } from './../../model/bean_aluno/aluno';
import { AlunoService } from './../servicos_aluno/aluno.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'materialize-css';
import { ProfessorService } from '../servicos_professor/professor.service';
import { Professor } from 'src/app/model/bean_professor/professor';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private professor_servico: ProfessorService,
    private aluno_servico: AlunoService
  ) { }

  //Variavel Logado ou nao
  private usuarioAutenticado: boolean = false;

  //Variavel para emitir a mudança da variavel
  mostrarMenuEmitter = new EventEmitter<boolean>();

  // Função que faz a verificação geral do login
  fazerLogin(email, senha, lembrar_de_mim) {
    // Verifica se já existe algum usuário logado
    if (localStorage.getItem("usuario_logado") != null || sessionStorage.getItem("usuario_logado") != null) {
      toast({html:"Já existe uma conta logada!"});
      return;
    }
    // Puxa os dados do professor a partir do email oferecido
    this.professor_servico.obterDadosProfessor(email).subscribe((professor: Professor) => {
      // Se existir o usuário então verifica a senha
      if (professor != null && professor.senha_professor == senha) {
          // Caso ele queira que seja lembrado mesmo se fechar o navegador, então será armazenado no localStorage
          if (lembrar_de_mim == true) {
            localStorage.setItem("usuario_logado", professor.codigo);
            localStorage.setItem("professor_logado", professor.codigo);
          } else {
            // Caso ele não queira que seja lembrado então armazena no sessionStorage
            sessionStorage.setItem("usuario_logado", professor.codigo);
            sessionStorage.setItem("professor_logado", professor.codigo);
          }
          this.router.navigate(['/', 'home']);
      } else {
        // Puxa os dados do aluno a partir do email oferecido
        this.aluno_servico.obterDadosAluno(email).subscribe((aluno: Aluno) => {
          // Se existir o usuário então verifica a senha
          if (aluno != null && aluno.senha_aluno == senha) {
              // Caso ele queira que seja lembrado mesmo se fechar o navegador, então será armazenado no localStorage
              if (lembrar_de_mim == true) {
                localStorage.setItem("usuario_logado", aluno.codigo);
              } else {
                // Caso ele não queira que seja lembrado então armazena no sessionStorage
                sessionStorage.setItem("usuario_logado", aluno.codigo);
              }
              this.router.navigate(['/', 'home']);
          } else {
            // Caso não ache nenhum usuário
            toast({html:"Email e senha incorretos ou não cadastrados!"});
          }
        })
      }
    })
  }

  // Metodo para retornar se o usuário está ou nao autenticado
  getUsuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }

 


}
