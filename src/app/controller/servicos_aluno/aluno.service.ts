import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Aluno } from './../../model/bean_aluno/aluno';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  // URL do Banco Postman.
  url: string = 'http://localhost:8090/api/aluno';

  constructor(private http: HttpClient) { }

  // Método Obter Dados Alunos 
  public obterDadosAluno(emailAluno: String) {
    return this.http.get<Aluno>(this.url + '/' + emailAluno);
  }

  // Método Listar Dados
  public listarAlunos() {
    return this.http.get<Aluno[]>(this.url);
  }

  // Método Cadastrar Alunos
  public cadastrarAluno(aluno: Aluno) {
    return this.http.post(this.url, aluno);
  }

  // Método Alterar Alunos
  public alterarAluno(aluno: Aluno, emailAluno: String) {
    return this.http.put(this.url + '/' + emailAluno, aluno);
  }

  // Método Excluir Alunos
  public excluirAluno(emailAluno: string) {
    return this.http.delete(this.url + '/' + emailAluno);
  }
}