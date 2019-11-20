import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CadastroProfessorComponent } from './cadastro-professor/cadastro-professor.component';
import { ProfessorService } from './../../controller/servicos_professor/professor.service';
import { PainelAdministrativoComponent } from './painel-administrativo/painel-administrativo.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';

import { TextMaskModule } from 'angular2-text-mask';
import { ProfessorRoutingModule } from './professor.routing.module';


@NgModule({
  declarations: [
    CadastroProfessorComponent,
    PainelAdministrativoComponent,
    FinanceiroComponent
  ],
  imports: [
    CommonModule,
    ProfessorRoutingModule,
    FormsModule,
    TextMaskModule
  ],
  providers:[
    ProfessorService
  ]
})
export class ProfessorModule { }
