import { Curso } from './../../../model/bean_curso/curso';
import { CursosService } from './../../../controller/servicos_curso/cursos.service';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CursoDetalheResolver implements Resolve<Curso>{

    constructor(private cursoService: CursosService) { }

    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<any>|Promise<any>|any {

        // console.log("AlunoDetalheResolver");
        let codigo = route.params['codigo'];
        
        // console.log('O Id do Resolver é:'+codigo);

        return this.cursoService.obterDadosCurso(codigo);
    }

}