import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Imports
import * as M from 'materialize-css';
import { CursosService } from './../../../controller/servicos_curso/cursos.service';
import { AlunoProfessorService } from './../../../controller/servicos_aluno_professor/aluno-professor.service';

import { Curso } from './../../../model/bean_curso/curso';
import { Professor } from 'src/app/model/bean_professor/professor';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
  preserveWhitespaces: true
})
export class CursosComponent implements OnInit {

  //Variaveis 
  subscribeCursos: Curso[];
  subscribeProfessores: Professor[];
  cursoSelecionado: Curso = new Curso;
  cursoAlteracao: Curso = new Curso;
  curso: Curso = new Curso();

  // Variavel criar componente
  profLogado = false;
  modoAlterar = false;
  carregamentoCurso = false;
  carregamentoExclusao = false;

  // Modal
  modal: any;


  constructor(
    private cursoService: CursosService,
    private alunoProfessorS: AlunoProfessorService
  ) { }

  ngOnInit() {
    // Primeira Selecao    
    this.primeiraAcao();

  }

  //Mascara de Dinheiro
  private valor_mask = [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/];

  // Retornar o email do professor logado
  private professor_logado() {
    return localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
  }
  private aluno_logado() {
    return localStorage.getItem("usuario_logado") == null ? sessionStorage.getItem("usuario_logado") : localStorage.getItem("professor_logado");
  }

  private primeiraAcao() {

    // Verificando professor ou Aluno Logado
    if (this.professor_logado() != null) {

      // Setando variavel de controle
      this.profLogado = true;

      // Retornando os Cursos do Professor
      this.retornaCursoProfessor(this.professor_logado());
      // Esperando receber os dados do banco para atualizar na lista
      setTimeout(() => {
        // Selecionando o primeiro curso 
        this.selecionaCurso(this.subscribeCursos[0].codigo);
        // Tirando o carregamento
        this.carregamentoCurso = true;
      }, 500);
    } else {
      // Retornando o vetor do aluno
      var emailAluno = this.aluno_logado();
      this.alunoProfessorS.listarProfessoresAluno(emailAluno)
        .subscribe(resposta => this.subscribeProfessores = resposta);

      // Populando o ComboBox
      setTimeout(() => {
        this.popularComboBox(this.subscribeProfessores);
        // Tirando o carregamento
        this.carregamentoCurso = true;
      }, 600);
    }


  }

  // Metodo para selecionar o curso e listar o detalhes
  private selecionaCurso(cod_curso) {
    // Buscando o curso no Vetor
    this.cancelar();
    for (var i = 0; i <= this.subscribeCursos.length - 1; i++) {
      if (cod_curso == this.subscribeCursos[i].codigo) {
        this.cursoSelecionado = this.subscribeCursos[i];
        break;
      }
    }
  }

  // Preparar a tela para o metodo alterar.
  private prepAlterar() {
    // Seleciona o curso
    this.cursoAlteracao = this.cursoSelecionado;

    // Populando o Nome
    var input01: HTMLInputElement = <HTMLInputElement>document.getElementById('nome_curso');
    input01.value = this.cursoSelecionado.nome_curso;
    input01.classList.add('valid');

    var input02: HTMLLabelElement = <HTMLLabelElement>document.getElementById("label_nome");
    input02.classList.add("active");

    // Populando o Valor
    input01 = <HTMLInputElement>document.getElementById('valor_curso');
    input01.value = (this.cursoSelecionado.preco_hora_aula).toString();
    input01.classList.add('valid');

    input02 = <HTMLLabelElement>document.getElementById("label_valor");
    input02.classList.add("active");

    // Populando o TextArea
    var input = <HTMLTextAreaElement>document.getElementById('desc_curso');
    input.value = this.cursoSelecionado.descricao_curso;
    console.log(this.cursoSelecionado)
    input.classList.add('valid');

    input02 = <HTMLLabelElement>document.getElementById("label_desc");
    input02.classList.add("active");

    // Mostrando o botao de Alterar os dados
    this.modoAlterar = true;
  }

  // Alterando o curso
  private alterar() {

    // Pegando o valor do Codigo
    var codigoCurso: number = this.cursoAlteracao.codigo;

    // Passando Nome
    var elemento = <HTMLInputElement>document.getElementById('nome_curso');
    this.cursoAlteracao.nome_curso = elemento.value;

    // Passando Valor da Aula
    elemento = <HTMLInputElement>document.getElementById('valor_curso');
    this.cursoAlteracao.preco_hora_aula = parseInt(elemento.value);

    // Passando Descricao do Curso
    var elemento1 = <HTMLTextAreaElement>document.getElementById('desc_curso');
    this.cursoAlteracao.descricao_curso = elemento1.value;

    // Metodo Alterar
    this.cursoService.alterarCurso(this.cursoAlteracao)
      .subscribe((resposta) => {

        resposta = JSON.stringify(resposta).substring(13).replace('"}', "");

        // Verificando se a alteração ocorreu bem
        switch (resposta) {
          case "Registro atualizado com sucesso!":
            M.toast({ html: "Registro atualizado com sucesso!" });
            this.cancelar();
            break;

          default:
            M.toast({ html: "Ocorreu um erro ao alterar o Registro." });
            break;
        }
      })
  }

  // Metodo Cancelar - Resetando a tela de Cadastro / Alteração
  private cancelar() {
    // Voltando à tela de Cadastro
    this.modoAlterar = false;

    // Resetando o Nome
    var input01: HTMLInputElement = <HTMLInputElement>document.getElementById('nome_curso');
    input01.value = '';
    input01.classList.remove('valid');

    var input02: HTMLLabelElement = <HTMLLabelElement>document.getElementById("label_nome");
    input02.classList.remove("active");

    // Resetando o Valor
    input01 = <HTMLInputElement>document.getElementById('valor_curso');
    input01.value = '';
    input01.classList.remove('valid');

    input02 = <HTMLLabelElement>document.getElementById("label_valor");
    input02.classList.remove("active");

    // Resetando o TextArea
    var input = <HTMLTextAreaElement>document.getElementById('desc_curso');
    input.value = '';
    input.classList.remove('valid');

    input02 = <HTMLLabelElement>document.getElementById("label_desc");
    input02.classList.remove("active");
  }

  // Filtrar os cursos conforme professor selecionado no Select
  private selecionaSelect() {
    var select = <HTMLSelectElement>document.getElementById('select');
    this.retornaCursoProfessor(select.value);
  }

  // Metodo para popular o combobox com professores dos alunos
  private popularComboBox(professor: Professor[]) {
    // Selecionando o Componente
    var select = <HTMLSelectElement>document.getElementById("select");
    var opt1;

    // Percorrendo o vetor
    for (var i = 0; i <= this.subscribeProfessores.length - 1; i++) {

      opt1 = <HTMLOptionElement>document.createElement("option");
      opt1.value = this.subscribeProfessores[i].codigo;

      opt1.text = this.subscribeProfessores[i].nome_professor;

      select.add(opt1, select.options[i]);
    }

    var elem2 = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elem2);

    // Selecionando a primeira opcao do Vetor
    this.retornaCursoProfessor(select.value);
    setTimeout(() => {
      this.selecionaCurso(this.subscribeCursos[0].codigo);
    }, 35)

  }

  // Metodo para retornar os Cursos do Professor
  private retornaCursoProfessor(email: string) {
    this.cursoService.listarCursos(email)
      .subscribe((cursos) => {
        this.subscribeCursos = cursos;
      })
  }

  // Metodo para excluir o curso
  private excluir(curso: Curso) {
    this.carregamentoExclusao = true;

    this.cursoService.verificaCurso(curso).subscribe((resposta) => {
      // Se for False - Excluir{}
      if (!resposta) {

        // Realizando exclusao
        this.cursoService.excluirCurso(curso.codigo).subscribe(resposta => {
          resposta = JSON.stringify(resposta).substring(13).replace('"}', "");
          if (resposta == "Registro excluido com sucesso!") {

            setTimeout(() => {
              M.toast({ html: 'Curso excluido com sucesso!' });
              this.retornaCursoProfessor(this.professor_logado());
              this.carregamentoExclusao = false;
            }, 800)
          }
        })

        // Se for verdadeiro o 
      } else {
        // Atribuindo variavel
        this.modal = $('.modal');
        // Iniciando Modal
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(this.modal);

        // Abrindo modal
        M.Modal.getInstance(this.modal).open();

        // Escondendo o carregamento
        this.carregamentoExclusao = false;
      }
    })
  }

  private excluir2(curso: Curso) {
    // Realizando exclusao
    this.cursoService.excluirCurso(curso.codigo).subscribe(resposta => {
      resposta = JSON.stringify(resposta).substring(13).replace('"}', "");
      if (resposta == "Registro excluido com sucesso!") {
        setTimeout(() => {
          M.toast({ html: 'Curso excluido com sucesso!' });
          this.retornaCursoProfessor(this.professor_logado());

          // Fechando o modal
          M.Modal.getInstance(this.modal).close();
        }, 800)
      }
    })

  }

  private cadastrar() {
    // Colocando o e-mail do Professor
    this.curso.email_professor = this.professor_logado();

    // Div de Carregamento
    this.carregamentoExclusao = true;

    // Realizando o cadastro
    this.cursoService.cadastrarCurso(this.curso)
      .subscribe((resposta) => {
        resposta = JSON.stringify(resposta).substring(13).replace('"}', "");
        if (resposta == "Registro salvo com sucesso!") {
          setTimeout(() => {

            this.retornaCursoProfessor(this.professor_logado());
            M.toast({ html: 'Curso salvo com sucesso!' });
            this.cancelar();
            this.carregamentoExclusao = false;
          }, 800)
        } else {
          M.toast({ html: 'Erro ao cadastrar o curso. Tente novamente!' });
          this.carregamentoExclusao = false;

        }
      })
  }

}