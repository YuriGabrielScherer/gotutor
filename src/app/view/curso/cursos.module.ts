import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { CursosComponent } from './cursos/cursos.component';
import { CursoDetalheComponent } from './curso-detalhe/curso-detalhe.component';
import { CursoDetalheResolver } from './guards/curso-detalhe.resolver';

import { CursosRoutingModule } from './cursos.routing.module';
import { CursosService } from './../../controller/servicos_curso/cursos.service';

@NgModule({
    declarations: [
        //Todas as telas
        CursosComponent,
        CursoDetalheComponent
    ],
    imports: [
        CommonModule,
        CursosRoutingModule,
        FormsModule,
        TextMaskModule
        // RouterModule
    ],
    providers: [
        CursosService,
        CursoDetalheResolver
    ]
})
export class CursosModule { }