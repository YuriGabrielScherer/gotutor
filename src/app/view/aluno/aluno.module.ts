import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Telas
import { ListarAlunosComponent } from './listar-alunos/listar-alunos.component';
import { CriarSenhaComponent } from './criar-senha/criar-senha.component';
import { CadastroAlunoNovoComponent } from './cadastro-aluno-novo/cadastro-aluno-novo.component';
import { PerfilAlunoComponent } from './perfil-aluno/perfil-aluno.component';
// Services
import { AlunoRoutingModule } from './aluno.routing.module';
import { AlunoService } from './../../controller/servicos_aluno/aluno.service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    CadastroAlunoNovoComponent,
    CriarSenhaComponent,
    ListarAlunosComponent,
    PerfilAlunoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    AlunoRoutingModule
  ],
  providers:[
    AlunoService
  ]
})
export class AlunoModule { }