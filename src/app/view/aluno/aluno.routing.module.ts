import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Cadastros
import { CadastroAlunoNovoComponent } from './cadastro-aluno-novo/cadastro-aluno-novo.component';

//Listar Dados
import { PerfilAlunoComponent } from './perfil-aluno/perfil-aluno.component';
import { CriarSenhaComponent } from './criar-senha/criar-senha.component';
import { ListarAlunosComponent } from './listar-alunos/listar-alunos.component';



const alunoRoutes: Routes = [
  //Cadastro
  { path: 'cadAluno', component: CadastroAlunoNovoComponent },
  // Listar Dados
  { path: 'criarSenha', component: CriarSenhaComponent },
  { path: 'listarAlunos', component: ListarAlunosComponent },
  { path: 'perfilAluno', component: PerfilAlunoComponent }

]
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(alunoRoutes)],
  exports: [RouterModule]
})

export class AlunoRoutingModule { }
