import { Component, Output, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { toast, Chips, Modal } from 'materialize-css';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Appointment } from './../../../model/bean_appointments/appointment.type';
import { Curso } from './../../../model/bean_curso/curso';
import { CursosService } from './../../../controller/servicos_curso/cursos.service';
import { Aluno } from './../../../model/bean_aluno/aluno';
import { AlunoProfessorService } from './../../../controller/servicos_aluno_professor/aluno-professor.service';
import { AulaService } from './../../../controller/servicos_aula/aula.service';
import { Aula } from './../../../model/bean_aula/aula';
import { TurmaService } from './../../../controller/servicos_turma/turma.service';
import { Turma } from './../../../model/bean_turma/turma';
import { Professor } from './../../../model/bean_professor/professor';


@Component({
  selector: 'app-calendario-todo',
  templateUrl: './calendario-todo.component.html',
  styleUrls: ['./calendario-todo.component.css']
})

export class CalendarioTodoComponent implements OnInit {

  isNew = null;
  calendarPlugins = [dayGridPlugin, interactionPlugin];
  semAula: boolean;
  modal: any;
  confirmacaoDeletar: boolean = false;

  // Vetor de cursos
  cursos = [];

  // Vetor de alunos caso o usuario logado seja um professor
  alunos = [];

  // Lista de professores caso o usuario logado seja um aluno
  professoresLista: Professor[] = [];

  // Boolean que verifica se é aluno logado ou professor
  alunoLogado: boolean;

  // Variavel para setar o professor
  professorSelecionado: string;

  // Variavel de professor selecionado ou professor logado
  professor: string;

  // Variavel auxiliar para carregar o subscribe de um componente para o outro
  carregou: boolean = false;

  private Aula: Aula = new Aula();
  @Output() appointmentDetail: Appointment;

  constructor(
    private AulaService: AulaService,
    private CursosService: CursosService,
    private AlunoProfessorService: AlunoProfessorService,
    private TurmaService: TurmaService
  ) { }

  // Vetor de eventos
  appointments: Appointment[] = [
    // {
    //   id: new Date().getTime().toString(),
    //   title: 'event1',
    //   start: new Date(),
    //   //end: ,
    //   // allDay: true,
    //   curso: 'Nenhum',
    //   // rendering: 'background',
    //   backgroundColor: '#80d8ff'
    // },
    // {
    //   id: (new Date().getTime()+1).toString(),
    //   title: 'event2',
    //   start: new Date(),
    //   //end: ,
    //   // allDay: true,
    //   curso: 'Nenhum',
    //   // rendering: 'background',
    //   backgroundColor: '#a7ffeb'
    // }
  ];

  async ngOnInit() {

    // Set na variavel global para pegar o codigo do professor
    this.retornarProf();

    const delay = async t => new Promise(resolve => setTimeout(resolve, t));
    var contador = 0;


    this.setAlunoLogado();
    if (this.alunoLogado) {
      // Chama função para retornar professores de determinado aluno
      this.retornaProfsDoAluno();
    } else {
      // Chama função para retornar alunos de determinado professor
      this.retornaAlunosDoProf();
    }

    // Função para carregar dados do subscribe
    while (!this.carregou && contador < 20) {
      await delay(100);
      contador++;
    }

    // Chama função para retornar cursos de determinado professor
    this.retornarCursos();

    this.modal = $('.modal');
    Modal.init(this.modal);
  }

  // Abre pra add novo evento
  onRequestNewAppointment(e: Appointment): void {
    console.log('Rodou onRequestNewAppointment no calendario todo');
    if (!this.semAula) {

      console.log(!this.semAula);
      this.isNew = true;
      this.appointmentDetail = e;

    }
    console.log(e);
    this.appointmentDetail = e;

  }

  // Abre pra atualizar evento
  onRequestUpdateAppointment(e: Appointment): void {
    console.log('Rodou onRequestUpdateAppointment no calendario todo');
    if (e.title == 'deletar') {
      this.onUpdate(e);
    } else {
      this.isNew = false;
      this.appointmentDetail = e;
    }

  }

  // Fecha formulario
  onCloseAppointmentDetail(): void {
    console.log('Rodou onCloseAppointmentDetail no calendario todo');
    Modal.getInstance(this.modal).close();
    this.appointmentDetail = null;
    this.isNew = null;
  }

  retornarProfLogado() {
    return localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
  }

  retornarProf() {
    if (this.alunoLogado) {
      this.professor = this.professorSelecionado;
    } else {
      this.professor = this.retornarProfLogado();
    }
  }

  // Função para retornar cursos de determinado professor
  retornarCursos() {
    this.CursosService.listarCursos(this.professor).subscribe((Cursos: Curso[]) => {
      while (this.cursos.length > 0) {
        this.cursos.pop();
      }
      Cursos.forEach(Curso => {
        this.cursos.push(Curso.nome_curso);
      });
    });
  }

  retornaAlunosDoProf() {
    this.carregou = false;
    this.AlunoProfessorService.listarAlunoProfessor(this.retornarProfLogado()).subscribe((Alunos: Aluno[]) => {
      Alunos.forEach(Aluno => {
        this.alunos[Aluno.codigo] = null;
      });
      this.carregou = true;
    });
  }

  retornaProfsDoAluno() {
    var aluno = localStorage.getItem("usuario_logado") == null ? sessionStorage.getItem("usuario_logado") : localStorage.getItem("usuario_logado");
    this.carregou = false;
    this.AlunoProfessorService.listarProfessoresAluno(aluno).subscribe((Professores: Professor[]) => {
      Professores.forEach(Professor => {
        this.professoresLista.push(Professor);
      });
      this.carregou = true;
    });
  }

  setAlunoLogado() {
    if (this.retornarProfLogado() == null) {
      this.alunoLogado = true;
    } else {
      this.alunoLogado = false;
    }
  }

  salvarAula(codigo: string, title: string, data_aula_inicio: string, data_aula_fim: string, dia: string, allDay: boolean, descricao_aula: string,
    local_aula: string, curso: string, tipo_cadastro: number) {
    // Tipo cadastro: 1: cadastrar, 2: alterar, 3:semaula

    this.CursosService.listarCursos(this.professor).subscribe((Cursos: Curso[]) => {
      this.Aula.codigo = codigo;
      this.Aula.data_aula_inicio = data_aula_inicio;
      this.Aula.data_aula_fim = data_aula_fim;
      this.Aula.dia = dia;
      this.Aula.allDay = allDay;
      this.Aula.descricao_aula = descricao_aula;
      this.Aula.solicitacao_aula = this.alunoLogado;
      this.Aula.email_professor = this.professor;
      this.Aula.local_aula = local_aula;
      if (tipo_cadastro == 3) {
        this.Aula.id_curso = null;
        tipo_cadastro = 1;
      } else {
        Cursos.forEach(Curso => {
          if (Curso.nome_curso == curso) {
            this.Aula.id_curso = Curso.codigo;
          }
        });
      }

      if (tipo_cadastro == 1) {
        const moment = extendMoment(Moment);
        var duracaoAula = moment(data_aula_fim).diff(moment(data_aula_inicio), 'seconds');
        this.AulaService.cadastrarAula(this.Aula, title, duracaoAula).subscribe((msg: string) => {
          var mostrar = false;
          var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
          switch (retorno_msg) {
            case "Registro salvo com sucesso!":
              mostrar = true;
              break;
          }
          toast({ html: mostrar == true ? retorno_msg : "Ocorreu algum erro ao efetuar o cadastro!" });
        })
      } else if (tipo_cadastro == 2) {
        this.AulaService.alterarAula(this.Aula, this.Aula.codigo, title).subscribe((msg: string) => {
          var mostrar = false;
          var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
          switch (retorno_msg) {
            case "Registro atualizado com sucesso!":
              mostrar = true;
              break;
          }
          toast({ html: mostrar == true ? retorno_msg : "Ocorreu algum erro ao efetuar o cadastro!" });
        })
      }
    })
  }

  excluirAula(codigo: string) {
    this.AulaService.excluirAula(codigo).subscribe((msg: string) => {
      var mostrar = false;
      var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
      switch (retorno_msg) {
        case "Registro excluido com sucesso!":
          mostrar = true;
          break;
      }
      toast({ html: mostrar == true ? retorno_msg : "Ocorreu algum erro ao excluir o cadastro!" });
    })
  }

  //Adiciona
  onAdd(appointment: Appointment): void {

    console.log('Rodou onAdd no calendario todo');

    // Botao pra identificar que nao quer dar aula
    if (!this.semAula) {
      const moment = extendMoment(Moment);
      var range1 = moment().range(appointment.start, appointment.end);
      var overlap = false;

      // Verifica se o evento a criar nao sobrepoe outros eventos
      for (var i = 0; i < this.appointments.length; i++) {
        var range2 = moment().range(this.appointments[i].start, this.appointments[i].end);
        if (range1.overlaps(range2)) {
          console.log('tem overlap');
          console.log(range1, range2);
          overlap = true;
          toast({ html: 'Este horário já está ocupado!' });
          break;
        }
      }

      // Aqui é como se fosse um 'else' da funcao que verifica se nao sobrepoe
      if (!overlap) {
        console.log('Rodou onAdd no calendario todo if e appointment:');
        // console.log(appointment);

        var AppointmentBD = { id: new Date().getTime().toString(), ...appointment };
        this.appointments = [...this.appointments, AppointmentBD];
        console.log(AppointmentBD);

        this.salvarAula(AppointmentBD.id, AppointmentBD.title, AppointmentBD.start, AppointmentBD.end, AppointmentBD.dia, AppointmentBD.allDay,
          AppointmentBD.descricao, AppointmentBD.local, AppointmentBD.curso, 1);

        // Fechando o formulario
        this.onCloseAppointmentDetail();
      }


    } else {
      console.log('Rodou onAdd no calendario todo else e appointment:');
      var AppointmentBD = { id: new Date().getTime().toString(), ...appointment };
      console.log(AppointmentBD);
      this.appointments = [...this.appointments, AppointmentBD];

      // Adicionar aula ao banco aqui
      this.salvarAula(AppointmentBD.id, AppointmentBD.title, AppointmentBD.start, AppointmentBD.end, AppointmentBD.dia, AppointmentBD.allDay,
        "", "", null, 3);
      this.appointmentDetail = null;
    }
  }

  //Atualiza e/ou deleta
  onUpdate(appointment: Appointment): void {

    console.log('Rodou onUpdate no calendario todo com evento: ');
    console.log(appointment);

    //Fecha modal
    Modal.getInstance(this.modal).close();

    //Atualiza
    this.appointments = this.appointments.map(
      a => a.id === appointment.id ? { ...a, ...appointment } : a

    );

    // Variavel que vai identificar se deletou ou nao o evento depois da funcao
    var deletou_evento = false;

    //Deleta se o título for 'deletar'
    if (appointment.title == 'deletar') {
      for (var i = 0; i < this.appointments.length; i++) {
        if (this.appointments[i].title == 'deletar') {
          this.appointments.splice(i, 1);
          deletou_evento = true;
          break;
        }
      };
    }

    if (!deletou_evento) {

      // atualizar evento no banco aqui
      this.salvarAula(appointment.id, appointment.title, appointment.start, appointment.end, appointment.dia, appointment.allDay,
        appointment.descricao, appointment.local, appointment.curso, 2);

    } else {

      // appointment.id é o cara que sera deletado no banco
      this.excluirAula(appointment.id);

    }

    console.log('depois');
    console.log(this.appointments);

    this.onCloseAppointmentDetail();

  }

  // Funcao que chama a funcao para o metodo atualizar
  onAppointmentUpdated(appointment: Appointment): void {
    console.log('Rodou onAppointmentUpdated no calendario todo');
    this.onUpdate(appointment);
  }

  //Recebe o novo valor da var semAula
  receberSemAula(semAula: boolean): void {
    this.semAula = semAula;
  }

  receberProfessorSelecionado(Professor: string): void {
    this.professorSelecionado = Professor;
    this.retornarProf();
    this.retornarCursos();
  }

  //Confirmacao do delete
  onAbrirConfirmacao(appointment: Appointment): void {
    console.log('Rodou onAbrirConfirmcao no calendario-todo');

    this.appointmentDetail = appointment;

    Modal.getInstance(this.modal).open();
  }

}
