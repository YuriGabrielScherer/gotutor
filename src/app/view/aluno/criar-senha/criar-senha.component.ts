import { Aluno } from './../../../model/bean_aluno/aluno';

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-criar-senha',
  templateUrl: './criar-senha.component.html',
  styleUrls: ['./criar-senha.component.css']
})
export class CriarSenhaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.aluno.nome_aluno = "Yuri Gabriel";
  }

  //Criando o objeto
  aluno = new Aluno();

}
