import { CursosService } from './../../../controller/servicos_curso/cursos.service';
import { Component, OnInit } from '@angular/core';

// Materialize
import * as M from "materialize-css";
//Gráfico
import { Chart } from 'chart.js';
// Import
import { AulaService } from '../../../controller/servicos_aula/aula.service';
import { AlunoProfessorService } from './../../../controller/servicos_aluno_professor/aluno-professor.service';
import { TurmaService } from './../../../controller/servicos_turma/turma.service';
import { PagamentoService } from './../../../controller/servicos_pagamento/pagamento.service';
// Beans
import { Pagamento } from './../../../model/bean_pagamento/pagamento';
import { Aula } from '../../../model/bean_aula/aula';
import { Aluno } from '../../../model/bean_aluno/aluno';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})

export class FinanceiroComponent implements OnInit {

  // Variaveis para criacao dos Graficos do GayBriel
  ctx: any;
  ctx1: any;
  pieChart: any;
  barChart: any;

  // Array para a Tabela de Alunos
  listaAlunos: Aluno[];

  // Variavel validadora do Modal - Credito
  varParcelas: any = 'dinheiro';

  // Nome div Detalhes
  nome: any;

  // Objeto do Aluno selecionado para mostrar os dados
  alunoSelecionado: Aluno = new Aluno();

  // Arrays para mostrar os dados
  aulasSelecionadas: any[] = [];
  aulaSelecionada: Aula = new Aula;

  // Array para fazer filtros nos campos
  vetorTempAulas: any[] = [];

  // Vetor cursos do professor
  cursosProfessor: any[] = [];

  // Objeto temporario
  subscribeAula: Aula[];
  subscribeAluno: Aluno[];
  subscribePagamento: Pagamento[];

  // Validacao para criar componente apos o Load
  criarComponente = false;
  criarTabela = false;

  // Variavel para abrir o modal
  modal: any;

  constructor(
    private aulaService: AulaService,
    private alunoProfessorService: AlunoProfessorService,
    private pgtoService: PagamentoService,
    private cursoService:CursosService
  ) { }

  ngOnInit() {
    //Retornando dados do Banco de Dados
    this.aulaService.obterAulaProfessor(this.professor_logado())
      .subscribe(aulas => this.subscribeAula = aulas);

    this.alunoProfessorService.listarAlunoProfessor(this.professor_logado())
      .subscribe(alunoP => {
        this.subscribeAluno = alunoP;
      });

    // this.cursoService.listarCursos(this.professor_logado())
    //   .subscribe((cursos) => {
    //     this.cursosProfessor = cursos;
    //     console.log(this.cursosProfessor)
    //     console.log(...this.cursosProfessor.nome_curso)
    //   });

    // Primeira Selecao
    setTimeout(() => { this.primeiraSelecao(); }, 900);

    //Inicia o gráfico
    this.ctx = <HTMLCanvasElement>document.getElementById('pieChart');
    this.pieChart = new Chart(this.ctx, this.pieSettings);

    //Inicia o gráfico 2
    this.ctx1 = <HTMLCanvasElement>document.getElementById('barChart');
    this.barChart = new Chart(this.ctx1, this.barSettings);

    // Iniciando o Tooltip
    var elems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(elems, {
      outDuration: 50
    });

    // Iniciando o Tabs
    var elems = document.querySelectorAll('.tabs');
    M.Tabs.init(elems);
  }



  //Define como será o gráfico e é utilizado para edita-lo
  pieSettings = {
    type: 'pie',
    data: {
      labels: this.cursosProfessor,
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  };
  barSettings = {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Revenue by Month',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: true
    }
  };

  //Exemplo de como atualizar dados
  botao() {
    console.log(this.ctx);
    this.pieSettings.data.labels = ['Vermelho', 'Azul', 'Amarelo', 'Verde', 'Roxo', 'Laranja'];
    this.pieSettings.data.datasets[0].data = [1, 2, 3, 4, 5, 6];
    this.pieChart.update();
    //var pieChart = new Chart(this.ctx, this.pieSettings);
  }

  // Retornar o email do professor logado
  private professor_logado() {
    return localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
  }

  // Metodo executado quando o sistema é iniciado
  private primeiraSelecao() {

    // Primeira Selecao de Aluno Detalhe
    this.alunoSelecionado = this.subscribeAluno[0];

    if (this.alunoSelecionado == undefined) {
      // Mensagem que o Professor nao tem alunos
      M.toast({ html: "Você não possui alunos cadastrados" });
      // Campo para cadastrar um aluno
      var table = <HTMLTableElement>document.getElementById('table');
      var row = table.insertRow(1);

      // Insere uma coluna na nova linha
      var cell = row.insertCell(0);
      cell.classList.add('center');
      // Insere um conteúdo na coluna
      cell.innerHTML =
        "<a href='listarAlunos' "
        + "class='btn waves-effect waves-light green'>Cadastre novos alunos</a>"

    } else {
      //Atribuindo apenas o primeiro nome para aparecer no Detalhes
      this.nome = ((this.alunoSelecionado.nome_aluno).split(" "))[0];

      // Populando o vetor de Aulas
      var cod_aluno = this.alunoSelecionado.codigo;

      this.gerarVetorAula(this.alunoSelecionado.codigo);

      // Mostrando o componente de Detalhes
      this.criarComponente = true;
    }

  }


  // Metodo para filtrar as aulas inadimplentes do alunos
  private filtrarLista(valorFiltro: string) {

    // Verificando o valor do Filtro
    if (valorFiltro == "Todos") {
      this.aulasSelecionadas = this.vetorTempAulas;
    } else {

      // Limpando o vetor de aulas selecionadas
      this.aulasSelecionadas = [];

      // Percorrendo o vetor e filtrando.
      for (var a = 0; a <= this.vetorTempAulas.length - 1; a++) {
        if (this.vetorTempAulas[a].pagou_pagamento == valorFiltro) {
          this.aulasSelecionadas.push(this.vetorTempAulas[a]);
        }
      }
    }
  }

  // Código para Selecionar o Aluno e Mudar na DIV Detalhes
  private selecionaAluno(cod_aluno) {
    // Buscando na lista de Alunos
    for (var i = 0; i <= this.subscribeAluno.length - 1; i++) {
      // Adicionando nos detalhes do Aluno
      if (cod_aluno == this.subscribeAluno[i].codigo) {
        this.alunoSelecionado = this.subscribeAluno[i];
        this.nome = ((this.alunoSelecionado.nome_aluno).split(" "))[0];
        break;
      }
    }

    // Atualizando a lista de aulas do aluno
    this.gerarVetorAula(cod_aluno);
  }

  // Metodo para gerar o vetor e popular a tabela de aulas do aluno selecionado
  private gerarVetorAula(cod_aluno) {

    // Colocando o componente para carregar
    this.criarTabela = false;

    // Limpando vetor de Aula Selecionada
    this.aulasSelecionadas = [];

    // Criando o Vetor temporario
    var vetorTemporario: Aula[];

    // Retornando as aulas do aluno e professor
    this.aulaService.getAulaAlunoProf(this.professor_logado(), cod_aluno)
      .subscribe((resultado) => {
        // console.log(resultado)
        vetorTemporario = resultado;
      })


    // Retornando os pagamentos do Aluno e Professor
    this.pgtoService.obterPagamentosProfessor(this.professor_logado(), cod_aluno)
      .subscribe((resultado) => {
        // console.log(resultado)
        this.subscribePagamento = resultado;
      })

    // Parada no código para rodar o subscribe
    setTimeout(() => {

      // Percorrendo o vetor de pagamento que tem o mesmo tamanho que o de Aulas
      for (var a = 0; a <= this.subscribePagamento.length - 1; a++) {
        // Criando um novo objeto para mostrar os dados
        if (this.subscribePagamento[a].id_aula == vetorTemporario[a].codigo) {
          // ... é um iterador e passa os elementos de dentro do vetor
          // Não o vetor em si.
          this.aulasSelecionadas.push({
            ...vetorTemporario[a],
            ...this.subscribePagamento[a],
            codigo: vetorTemporario[a].codigo,
            pagou_pagamento: this.subscribePagamento[a].pagou_pagamento == false ? 'Não' : 'Sim'
          });

        }
      }

      // Tirando o componente carregar
      this.criarTabela = true;
      this.vetorTempAulas = this.aulasSelecionadas;
    }, 500);
  }

  // Metodos para mostrar o campo parcelas ou nao
  private mudouSelect() {
    // Retornando campo
    var elemento = <HTMLSelectElement>document.getElementById('select');
    // Validando
    this.varParcelas = elemento.value;
  }

  // Metodo para selecionar a aula e abrir o Modal
  private selecionarAula(cod_aula, verifica) {

    // Verificando se o usuário pagou ou nao tal aula
    if (verifica == "Não") {

      // Iniciando o Modal
      this.modal = $('.modal');
      M.Modal.init(this.modal);

      // Iniciando o Input Calendar
      var elems = document.querySelectorAll('.datepicker');
      M.Datepicker.init(elems,
        {
          i18n: {
            today: 'Hoje',
            clear: 'Limpar',
            cancel: 'Sair',
            done: 'Confirmar',
            labelMonthNext: 'Próximo mês',
            labelMonthPrev: 'Mês anterior',
            labelMonthSelect: 'Selecione um mês',
            labelYearSelect: 'Selecione um ano',
            selectMonths: true,
            selectYears: 8,
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'],
            weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
          },
          showClearBtn: true,
          format: 'dd mmmm, yyyy',
          container: 'body',
          maxDate: new Date(),

          //onClose: Datepicker.setDate(new Date())
          //Adicionar código para limpar essa tela.

        });

      // Iniciando o Select
      var elems1 = document.querySelectorAll('select');
      M.FormSelect.init(elems1);

      // Abrindo o modal
      M.Modal.getInstance(this.modal).open();

      // console.log(cod_aula);

      // Populando o vetor de Aula Selecionada
      for (var i = 0; i <= this.aulasSelecionadas.length - 1; i++) {
        if (cod_aula == this.aulasSelecionadas[i].codigo) {
          this.aulaSelecionada = this.aulasSelecionadas[i];
          break;
        }
      }
    }


  }

  private excluirInadimplencia() {

    // Validando o formulario
    if (this.validarExclusao()) {

      // Variaveis temporarias
      var pgtoNovo: Pagamento;

      // Pegando o codigo do Pagamento Antigo
      for (var a = 0; a <= this.subscribePagamento.length - 1; a++) {
        if (this.aulaSelecionada.codigo == this.subscribePagamento[a].id_aula) {
          // console.log(this.subscribePagamento[a]);
          // console.log(this.subscribePagamento[a]);
          pgtoNovo = this.subscribePagamento[a];
          break;
        }
      }

      // Pegando valor do Select
      var select = (<HTMLSelectElement>document.getElementById('select')).value;
      var parcelas = (<HTMLInputElement>document.getElementById('parcelas')).value;

      // Alterando os valores
      pgtoNovo.pagou_pagamento = true;
      pgtoNovo.tipo_pagamento = select;
      pgtoNovo.parcelas_pagamento = parseInt(parcelas);

      // console.log(pgtoNovo);

      // Alterando a Inadimplencia
      this.pgtoService.alterarPagamento(pgtoNovo)
        .subscribe((resposta) => {

          resposta = JSON.stringify(resposta).substring(13).replace('"}', "");
          if (resposta == "Registro atualizado com sucesso!") {
            // console.log('ok');
            // Mensagem para o usuario
            M.toast({ html: 'Inadimplência excluída com sucesso!' });

            // Atualizando a listagem de Aulas
            this.gerarVetorAula(this.alunoSelecionado.codigo);

            // Fechando o modal       
            M.Modal.getInstance(this.modal).close();

          }
        });
    } else {
      M.toast({ html: 'Preencha corretamente o formulário!' });
    }
  }

  // Metodo para validar o formulario de exclusao de Inadimplencia
  private validarExclusao() {

    // Pegando os campos
    var select = (<HTMLSelectElement>document.getElementById('select')).value;

    var datetime = (<HTMLInputElement>document.getElementById('datepicker')).value;

    if ((select == "") || (datetime == "")) {
      return false;
    } else {
      return true;
    }
  }

}
