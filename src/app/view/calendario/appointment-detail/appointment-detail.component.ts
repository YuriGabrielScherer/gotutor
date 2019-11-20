import { Component, SimpleChanges, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Appointment } from './../../../model/bean_appointments/appointment.type';
import 'fullcalendar';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { FormSelect, Chips } from 'materialize-css';
import { CursosService } from './../../../controller/servicos_curso/cursos.service';
import { Curso } from './../../../model/bean_curso/curso';
import { Aluno } from './../../../model/bean_aluno/aluno';

@Component({
  selector: 'app-appointment-detail',
  template: `
      <div class="row" *ngIf="!appointment.allDay">
        <h2 class="col s12">{{appointment?.dia}}</h2>
      </div>
      <form class="appointmentForm" [formGroup]="form" [hidden]="appointment.allDay" id="form">
        <div class="form-group row">
          <div class="input-field col s6 m6 l6" *ngIf="!alunoLogado">
            <span>Aluno(s):</span>
            <div class="chips chips-autocomplete validate" id="divChip"></div>
            <span id="aluno-span">Algum aluno deve ser adicionado</span>
          </div>
          <div class="input-field col s6 m6 l6">
            <span>Curso:</span>
            <select formControlName="curso" class="select-cursos validate" id="select">
            <option *ngFor="let curso of cursos" [ngValue]="curso">
              {{ curso }}
            </option>
            </select>
            <span id="curso-span">Algum curso deve ser selecionado</span>
          </div>
        </div>
        
        <div class="form-group row">
          <div class="input-field col s6 m6 l6">
            <span>Início:</span>
            <input type="time" id="start" (keydown)="checaTempo($event)" (keyup)="checaTempo($event)" (click)="checaTempo($event)" formControlName="start"/>
            <span id="start-span">Este campo deve ser preenchido</span>
          </div>
          <div class="input-field col s6 m6 l6">
            <span>Fim:</span>
            <input type="time" id="end" (keydown)="checaTempo($event)" (keyup)="checaTempo($event)" (click)="checaTempo($event)" formControlName="end"/>
            <span id="end-span">Este campo deve ser preenchido</span>
          </div>
        </div>
        
        <div class="form-group row">
          <div class="input-field col s12">
            <label [ngClass]="{'active': !isNew }">Local:</label>
            <input type="text" class="validate form-control" formControlName="local" id="local"/>
            <span id="local-span">Algum local para o evento deve ser definido</span>
          </div>
        </div>
        <div class="form-group row">
          <div class="input-field col s12">
            <label [ngClass]="{'active': !isNew }">Descrição:</label>
            <textarea class="validate form-control materialize-textarea" formControlName="descricao" id="descricao"></textarea>
          </div>
        </div>
        <div class="center">
          <button type="submit" class="btn" *ngIf="isNew" (click)="onAdd()">Criar</button>
          <button type="submit" class="btn" *ngIf="!isNew" (click)="onUpdate()">Atualizar</button>
          <button type="submit" class="btn" *ngIf="!isNew" (click)="onDelete()">Excluir</button>
          <button type="button" class="btn" (click)="close.emit()">Cancelar</button>
        </div>
      </form>
  `,
  styleUrls: ['./appointment-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentDetailComponent implements OnChanges, AfterViewInit, OnInit {

  @Input() appointment: Appointment;
  @Input() isNew: boolean;
  @Input() elems: any;
  @Input() instances: any;
  
  @Input() appointmentDetail;
  @Input() semAula: boolean;
  //Pegar os cursos que o professor oferece dale vini
  @Input() cursos: any[];
  @Input() alunos: any[];
  @Input() alunoLogado: boolean;
  @Output() close = new EventEmitter();
  @Output() add = new EventEmitter<Appointment>();
  @Output() update = new EventEmitter<Appointment>();
  @Output() abrirConfirmacao = new EventEmitter<Appointment>();

  ngAfterViewInit() {
    var elems = $('.chips');
    var instances = Chips.init(elems,
      {
        autocompleteOptions: {
          data: this.alunos,
        },
        onChipAdd: function () { verificaChip() },
        onChipDelete: function () { verificaChip() }
      });

    // Converter de title para chip
    if (this.appointment.title != null) {
      this.lerTitle(this.appointment.title);
    }

    function verificaChip() {
      var elems = Chips.getInstance($('#divChip')).chipsData;
      if (elems.length == 0) {
        document.getElementById('aluno-span').style.display = 'block';
      } else {
        document.getElementById('aluno-span').style.display = 'none';
      }
    }
  }


  form = this.formBuilder.group({
    title: [null, Validators.required],
    allDay: [null],
    start: [],
    end: [],
    curso: [],
    rendering: [],
    dia: [],
    id: [],
    descricao: [],
    local: []

  })
  constructor(
    private formBuilder: FormBuilder,
    private CursosService: CursosService
  ) { }

  ngOnInit() {


  }

  ngOnChanges(simpleChanges: SimpleChanges): void {

    if (simpleChanges.appointment && simpleChanges.appointment.currentValue) {
      console.log('Rodou ngOnChanges no appointment detail');

      //Se for allday
      if (this.appointment.allDay) {
        console.log(this.appointment);
        this.form.patchValue({ ...this.appointment })
        this.onAdd();
      } else {

        this.form.patchValue({ ...this.appointment });
        console.log(this.form.value);
      }

    }
  }

  lerTitle(title: string) {
    var Alunos = title.split(",");
    var instance = Chips.getInstance($('#divChip'));
    Alunos.forEach(Aluno => {
      instance.addChip({
        tag: Aluno,
        image: '',
      });
    });
  }

  // Funçãozinha criada para pegar nome de cada aluno em cada chip
  lerChips() {
    var title_concat: any = "";
    var elems = Chips.getInstance($('#divChip')).chipsData;
    for (let i = 0; i < elems.length; i++) {
      title_concat += elems[i].tag + ",";
    }
    return (title_concat.substring(0, title_concat.length - 1));
  }

  //Emite evento com dados para adicionar aos appointments
  onAdd(): void {
    console.log('Rodou onAdd no appointment detail');

    var title;
    if (this.appointment.allDay ) {
      title = 'SemAula'
    }else {
      title = this.lerChips();
    }
    
    const { allDay, start, end, curso, dia, id, local, descricao } = this.form.value;

    if (this.semAula) {
      this.add.emit({ end: moment(end, 'DD/MM/YYYY HH:mm'), start: moment(start, 'DD/MM/YYYY HH:mm'), title, allDay, dia });
    } else {
      //Validação formulário
      if (!((title == '') || (title == undefined) || (start == '') || (end == '') || (curso == undefined) || (local == ''))) {
        console.log('end: ' + end + '  start: ' + start);
        const end1 = dia + ' ' + end;
        const start1 = dia + ' ' + start;
        this.add.emit({ end: moment(end1, 'DD/MM/YYYY HH:mm'), start: moment(start1, 'DD/MM/YYYY HH:mm'), title, allDay, curso, dia, local, descricao });
      }
      if ((title == '') || (title == undefined)) {
        // document.getElementById('divChip').className += ' invalid';
        document.getElementById('aluno-span').style.display = 'block';
      }

      if (curso == undefined) {
        document.getElementById('select').style.border = '1px solid rgb(255, 1, 1)';
        document.getElementById('curso-span').style.display = 'block';
      } else {
        document.getElementById('select').style.border = '1px solid rgb(85, 179, 90)';
        document.getElementById('curso-span').style.display = 'none';
      }

      if ((start == '')) {
        document.getElementById('start').style.borderBottom = '1px solid rgb(255, 1, 1)';
        document.getElementById('start-span').style.display = 'block';
      } else {
        document.getElementById('start').style.borderBottom = '1px solid rgb(85, 179, 90)';
        document.getElementById('start-span').style.display = 'none';
      }

      if ((end == '')) {
        document.getElementById('end').style.borderBottom = '1px solid rgb(255, 1, 1)';
        document.getElementById('end-span').style.display = 'block';
      } else {
        document.getElementById('end').style.borderBottom = '1px solid rgb(85, 179, 90)';
        document.getElementById('end-span').style.display = 'none';
      }

      if ((local == '') || (local == undefined)) {
        document.getElementById('local').classList.add('invalid');
        document.getElementById('local-span').style.display = 'block';
      } else {
        document.getElementById('local').classList.remove('wrong');
        document.getElementById('local-span').style.display = 'none';
      }
    }


  }

  //Emite evento para atualizar o appointment
  onUpdate(): void {
    console.log('Rodou onUpdate no appointment detail');
    const title = this.lerChips();
    const { end, start, allDay, id, curso, dia, local, descricao } = this.form.value;
    const end1 = dia + ' ' + end;
    const start1 = dia + ' ' + start;
    this.update.emit({ end: moment(end1, 'DD/MM/YYYY HH:mm'), start: moment(start1, 'DD/MM/YYYY HH:mm'), title, allDay, curso, dia, id, local, descricao });
  }

  //Emite evento para atualizar e como título 'deletar', ao atualizar identifica o titulo e deleta
  onDelete(): void {
    console.log('Rodou onDelete no appointment detail');
    const { end, start, allDay, id, curso, dia, local, descricao } = this.form.value;
    this.abrirConfirmacao.emit({end, start, allDay, id, curso, dia, local, descricao, title: 'deletar'});
  }

  checaTempo(e): void {
    if( (e.key == 'Backspace') || (e.key == 'Delete') ){
      console.log('Entrou no if');
      e.preventDefault();
    }

    var inputStart = <HTMLInputElement>document.getElementById('start');
    var inputEnd = <HTMLInputElement>document.getElementById('end');
    var stringValorEnd = inputEnd.value.slice(0, 2) + inputEnd.value.slice(3, 5);
    var valorStart = parseInt(inputStart.value.slice(0, 2) + inputStart.value.slice(3, 5));
    var valorEnd = parseInt(stringValorEnd);

    if (valorEnd <= valorStart) {
      inputEnd.value = inputStart.value.slice(0, 2) + inputEnd.value.slice(2, 5);
      inputEnd.stepUp(60);
      this.form.patchValue({ end: inputEnd.value });
    }
  }
  
}