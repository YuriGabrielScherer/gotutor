import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Cadastros
import { CadastroProfessorComponent } from './cadastro-professor/cadastro-professor.component';
import { PainelAdministrativoComponent } from './painel-administrativo/painel-administrativo.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';


const professorRoutes: Routes = [
  // Cadastro
  {path: 'cadProfessor', component: CadastroProfessorComponent},
  {path: 'administrativo', component: PainelAdministrativoComponent},
  {path: 'financeiro', component: FinanceiroComponent}
];

@NgModule({
  imports: [RouterModule.forChild(professorRoutes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }
