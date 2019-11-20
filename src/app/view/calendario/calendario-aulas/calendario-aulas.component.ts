import { Router } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import 'fullcalendar';
import * as $ from "jquery";
import { Moment } from 'Moment';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { Appointment } from './../../../model/bean_appointments/appointment.type';
import { CursosService } from './../../../controller/servicos_curso/cursos.service';
import { AulaService } from './../../../controller/servicos_aula/aula.service';
import { TurmaService } from './../../../controller/servicos_turma/turma.service';
import { AlunoProfessorService } from './../../../controller/servicos_aluno_professor/aluno-professor.service';
import { Aluno } from './../../../model/bean_aluno/aluno';
import { Curso } from './../../../model/bean_curso/curso';
import { Aula } from './../../../model/bean_aula/aula';
import { Turma } from './../../../model/bean_turma/turma';
import { Professor } from './../../../model/bean_professor/professor';
import { FormSelect, toast } from 'materialize-css';


@Component({
  selector: 'app-calendario-aulas',
  templateUrl: './calendario-aulas.component.html',
  styleUrls: ['./calendario-aulas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarioAulasComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {


  calendarPlugins = [dayGridPlugin, interactionPlugin, momentPlugin];


  @Input() viewModes = ['month', 'agendaWeek', 'agendaDay'];
  @Input() navButtons = ['prev', 'next', 'today'];
  @Input() appointments: Appointment[] = [];
  @Input() professoresLista: Professor[] = [];
  @Input() alunoLogado: boolean;
  @Input() professor: string;
  @Input() carregou: boolean = false;
  @Output() enviarProfessorSelecionado = new EventEmitter<string>();
  @Output() requestNewAppointment = new EventEmitter<Appointment>();
  @Output() requestUpdateAppointment = new EventEmitter<Appointment>();
  @Output() appointmentUpdated = new EventEmitter<Appointment>();
  @Output() enviarSemAula = new EventEmitter<boolean>();
  @ViewChild('calendar', { static: false }) calendar: ElementRef;

  semAula: boolean = false;
  professorSelecionado: string;

  constructor(
    private router: Router,
    private AulaService: AulaService,
    private CursosService: CursosService,
    private AlunoProfessorService: AlunoProfessorService,
    private TurmaService: TurmaService
  ) {
  }

  ngOnInit(): void {
    // Chama função para retornar as aulas do professor do banco
    this.retornarAulasBanco();

    moment.locale('pt-BR');

  }

  get $Instance(): any {
    return $(this.calendar.nativeElement);
  }

  ngOnDestroy(): void {
    this.$Instance.fullCalendar('destroy');
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.appointments && simpleChanges.appointments.currentValue) {
      console.log('Rodou ngOnChanges no calendario-aulas component');
      this.updateAppointments();
    }
  }

  setProfessorSelecionado(professorSelecionado) {
    this.professorSelecionado = professorSelecionado;
    this.enviarProfessorSelecionado.emit(professorSelecionado);
  }

  async listarProfessores() {

    const delay = async t => new Promise(resolve => setTimeout(resolve, t));
    var contador = 0;
    while (!this.carregou && contador < 20) {
      await delay(100);
      contador++;
    }

    var aluno = localStorage.getItem("usuario_logado") == null ? sessionStorage.getItem("usuario_logado") : localStorage.getItem("usuario_logado");
    var select = <HTMLSelectElement>document.getElementById("select");
    var opt1;

    for (var i = 0; i < this.professoresLista.length; i++) {

      opt1 = document.createElement("option");
      opt1.value = this.professoresLista[i].codigo;

      opt1.text = this.professoresLista[i].nome_professor;

      select.add(opt1, select.options[i]);
    }
    var instances = FormSelect.init(select);
    select.addEventListener("change", () => { this.setProfessorSelecionado(select.value) });
    this.setProfessorSelecionado(this.professoresLista[0].codigo);
  }

  retornarAulasBanco() {
    console.log(this.professor)
    // Primeiro subscribe para retornar um vetor de aulas do banco
    this.AulaService.obterAulaProfessor(this.professor).subscribe((Aulas: Aula[]) => {
      // Retorna um vetor dos cursos do professor
      this.CursosService.listarCursos(this.professor).subscribe((Cursos: Curso[]) => {
        // Começa um laço que percorre o vetor de aulas, para dar um push em cada um
        Aulas.forEach(Aula => {
          // Subscribe para retornar os alunos da aula especifica
          this.TurmaService.listarTurmaAula(Aula.codigo).subscribe((Turma: Turma[]) => {
            var id = Aula.codigo;
            var title = '';
            Turma.forEach(Aluno => {
              title += Aluno.email_aluno + ',';
            });
            title = title.substring(0, title.length - 1);
            var start = moment(Aula.data_aula_inicio);
            var end = moment(Aula.data_aula_fim);
            var dia = Aula.dia;
            var allDay = Aula.allDay;
            var rendering;
            if (allDay) {
              rendering = 'background';
            }
            var descricao = Aula.descricao_aula;
            var local = Aula.local_aula;
            var solicitacao_aula = Aula.solicitacao_aula;
            var curso;
            Cursos.forEach(Curso => {
              if (Curso.codigo == Aula.id_curso) {
                curso = Curso.nome_curso;
              }
            });
            // Insere os dados para o appointments
            this.appointments.push({ id, title, start, end, dia, allDay, rendering, descricao, local, solicitacao_aula, curso });
            // Reenderiza o calendario
            this.updateAppointments();
          });
        });
      })
    })
  }

  // Inicia o calendario
  ngAfterViewInit(): void {
    if (this.alunoLogado) {
      this.listarProfessores();
    }

    this.$Instance.fullCalendar({
      plugins: [dayGridPlugin, interactionPlugin, momentPlugin],
      selectable: true,
      editable: true,
      eventSources: [{
        events: this.appointments || [],
      }],
      timeZone: 'local',
      locale: 'pt-br',  //Coloca em português
      buttonText: {    //Coloca os botões em pt, ja q o locale n arrumou isso
        today: "Hoje",
        month: "Mês",
        week: "Semana",
        day: "Dia"
      },

      views: {
        week: {
          allDaySlot: false,
          columnFormat: 'ddd D/M'
        },
        day: {
          allDaySlot: false
        }
      },

      //Botão personalizado para marcar dias como sem aula
      customButtons: {
        semAula: {
          text: 'Marcar dia sem aula',
          click: () => this.inverteSemAula()
        }
      },

      header: {
        left: this.navButtons.join(','),
        center: 'title semAula',
        right: this.viewModes.join(',')
      },

      navLinkDayClick: (date) => {
        this.$Instance.fullCalendar('changeView', 'agendaDay');
        this.$Instance.fullCalendar('gotoDate', date);
      },

      //Faz eventos allday como render background
      eventDataTransform: function (event) {
        if (event.allDay == true) event.rendering = "background";
        return event;
      },

      //Mostra horário do fim do evento sempre
      displayEventEnd: true,

      //Tema. Pode ser modificado
      themeSystem: 'standard',

      //Torna o dia em um link
      navLinks: true,

      //Impede eventos sobrepostos
      eventOverlap: false,

      //Limita número de ventos em uma mesma data
      eventLimit: true,

      //Quando selecionado um dia que já possui eventos
      selectOverlap: (event: Appointment) => {
        console.log('Rodou selectOverlap com evento:');
        console.log(event);
        if (!this.retornaSemAula()) {
          if (event.rendering === 'background') {
            toast({ html: 'Não é possível cadastrar aulas neste dia!' });
          }
          //toast({ html: 'Não é possível cadastrar aulas neste dia!'});
          return !(event.rendering === 'background');
        } else {
          if (!(event.rendering === 'background')) {
            toast({ html: 'Para fazer isto, você deve remover as aulas marcadas neste dia!' });
            return false;
          } else {
            this.requestUpdateAppointment.emit(this.neutralize({ ...event, title: 'deletar' }));
          }

        }

      },

      //Ao selecionar uma data
      select: (start: Moment, end: Moment) => {
        console.log('Rodou select no calendario-aulas component');

        //Verifica se o o botão para nao trabalhar foi selecionado
        if (this.retornaSemAula()) {
          console.log('Passou no if semAula com com start e end');
          console.log(start, end);
          this.requestNewAppointment.emit(this.neutralize({ start: start.format('DD/MM/YY HH:mm'), end: end.format('DD/MM/YY HH:mm'), allDay: true, rendering: 'background', dia: start.format('DD/MM/YY') }));
        } else {
          console.log('Passou pro else semAula: ' + this.retornaSemAula());
          //Fix para manter o início e o fim do evento no mesmo dia ao preencher o form
          if (end.format('DD') != start.format('DD')) {
            end.subtract(1, 'day');
          }

          //Adiciona uma hora para o fim do evento
          end.add(1, 'hour');
          console.log(start, end);
          this.requestNewAppointment.emit(this.neutralize({ start: start.format('HH:mm'), end: end.format('HH:mm'), allDay: false, dia: start.format('DD/MM/YY') }));
        }


      },

      //Ao clicar em um evento
      eventClick: (event: Appointment) => {
        console.log('Rodou eventClick no calendario-aulas component');
        console.log(event.dia);

        if (!this.semAula) {
          event.start = event.start.format('HH:mm');
          event.end = event.end.format('HH:mm');
          this.requestUpdateAppointment.emit(this.neutralize(event));
        }

      },

      //Quando se arrasta um evento
      eventDrop: (event: Appointment, delta, revert) => {

        //Verifica se o botão semAula está toggled
        if (this.retornaSemAula()) {
          this.inverteSemAula();
        }
        console.log('Rodou eventDrop no calendario-auls component');
        console.log(event);
        event.dia = event.start.format('DD/MM/YY');
        this.appointmentUpdated.emit(this.neutralize(event));
      },

      fixedWeekCount: false,  //Para não exibir datas demais

      // ÍCONES DOS BOTÕES
      buttonIcons: {
        prev: 'left-single-arrow',
        next: 'right-single-arrow',
        prevYear: 'left-double-arrow',
        nextYear: 'right-double-arrow'
      },

      //Cor da tag q contém  nome do evento
      eventBackgroundColor:'#aa00ff'

    });

    $('button').addClass('btn');
    $('button').addClass('btnLineHeight');
  }

  //Remove e readiciona os eventos no appointments - diz ser necessário
  private updateAppointments(): void {
    console.log('Rodou updateAppointments no calendario-aulas component');
    // we have to do it this way, because other wise the plugin is dependent on the
    // reference of the event source. So we have to remove all event sources and add a new one
    this.$Instance.fullCalendar('removeEventSources', this.$Instance.fullCalendar('getEventSources'));
    this.$Instance.fullCalendar('addEventSource', { events: this.appointments });

  }

  //Devolve os valores do evento - só mantendo o padrão
  private neutralize(event: Appointment): Appointment {
    console.log('Rodou neutralize no calendario-aulas component');
    // the widget mutates the appointment in many ways. We can keep it consistent with this function
    const { start, end, allDay, title, id, curso, rendering, dia, local, descricao } = event;
    console.log(start, end);
    return { start, end, allDay, title, id, curso, rendering, dia, local, descricao };
  }

  //Retorna o valor da variavel semAula
  private retornaSemAula(): boolean {
    console.log('Rodou retornaSemAula no calendario-aulas. Retornou: ' + this.semAula);
    return this.semAula;
  }

  //Inverte e retorna o novo valor da variavel semAula
  public inverteSemAula(): void {
    this.semAula = !this.semAula;
    console.log('Rodou inverteSemAula no calendario-aulas. Ficou: ' + this.semAula);
    if (this.semAula) {
      document.getElementsByClassName('fc-semAula-button')[0].classList.add('darken-4');
    } else {
      document.getElementsByClassName('fc-semAula-button')[0].classList.remove('darken-4');
    }
    this.enviarSemAula.emit(this.semAula);
  }



}

