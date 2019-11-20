import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './view/login/login.component';
import { InstitucionalComponent } from './view/institucional/institucional.component';
import { EscolherCadastroComponent } from './view/escolher-cadastro/escolher-cadastro.component';

import { CalendarioTodoComponent } from './view/calendario/calendario-todo/calendario-todo.component';
import { AppointmentDetailComponent } from './view/calendario/appointment-detail/appointment-detail.component';
import { CalendarioAulasComponent } from './view/calendario/calendario-aulas/calendario-aulas.component';

// Separar em outro module de Routing

const routes: Routes = [
  // telas Normais
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'institucional', component: InstitucionalComponent },
  { path: 'escolher-cadastro', component: EscolherCadastroComponent },
  { path: 'calendario', component: CalendarioTodoComponent, children: [
      { path: '', component: CalendarioAulasComponent },
      { path: '', component: AppointmentDetailComponent }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
