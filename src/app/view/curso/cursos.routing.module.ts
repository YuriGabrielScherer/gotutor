import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Cursos
import { CursosComponent } from './cursos/cursos.component';
import { CursoDetalheComponent } from './curso-detalhe/curso-detalhe.component';
import { CursoDetalheResolver } from './guards/curso-detalhe.resolver';


const cursosRoutes: Routes = [
  {path: 'cursos', component: CursosComponent, 
    children: [
      {path: ':codigo', component: CursoDetalheComponent, resolve: { curso: CursoDetalheResolver }}]
  }
];

@NgModule({
  imports: [RouterModule.forChild(cursosRoutes)],
  exports: [RouterModule]
})
export class CursosRoutingModule { }
