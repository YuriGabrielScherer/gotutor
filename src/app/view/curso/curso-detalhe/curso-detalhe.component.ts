import { Curso } from './../../../model/bean_curso/curso';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-curso-detalhe',
  templateUrl: './curso-detalhe.component.html',
  styleUrls: ['./curso-detalhe.component.css']
})
export class CursoDetalheComponent implements OnInit {

  //Variaveis
  codigo: any;
  curso: any = new Curso();
  inscricao: Subscription;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.inscricao = this.route.data.subscribe(
      (info: { curso: Curso }) => {
        //Recebendo objeto do Cursos Resolver
        this.curso = info.curso;
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

}
