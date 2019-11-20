import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlunoProfessor } from './../../model/bean_aluno_professor/aluno-professor';
import { Aluno } from './../../model/bean_aluno/aluno';
import { Professor } from 'src/app/model/bean_professor/professor';

@Injectable({
  providedIn: 'root'
})
export class AlunoProfessorService {

  url: string = 'http://localhost:8090/api/aluno_professor';

  constructor(private http: HttpClient) { }

  // Método Selecionar
  public obterDadosAlunoProfessor(codigo: Number) {
    return this.http.get(this.url + '/' + codigo);
  }

  // Método Listar alunos com professor especifico
  public listarAlunoProfessor(email_professor: string) {
    return this.http.get<Aluno[]>(this.url + '/' + email_professor);
  }

  // Método Listar  professores com aluno especifico
  public listarProfessoresAluno(email_aluno: string) {
    return this.http.get<Professor[]>(this.url + '/professores/' + email_aluno);
  }

  // Método Cadastrar
  public cadastrarAlunoProfessor(AlunoProfessor: AlunoProfessor) {
    return this.http.post(this.url, AlunoProfessor);
  }

  // Método Alterar
  public alterarAlunoProfessor(Aluno: Aluno, email_professor: string) {
    return this.http.put(this.url + '/' + email_professor, Aluno);
  }

  // Método Excluir
  public excluirAlunoProfessor(email_aluno: string, email_professor: string) {
    return this.http.delete(this.url + '/' + email_aluno + '/' + email_professor);
  }
}
