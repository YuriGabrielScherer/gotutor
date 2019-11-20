import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Turma } from './../../model/bean_turma/turma';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  url: string = 'http://localhost:8090/api/turma';
  constructor(private http: HttpClient) { }

  // Listar todos os alunos vinculado a uma aula especifica
  public listarTurmaAula(codigoAula: string) {
    return this.http.get(this.url + '/listar_aluno/' + codigoAula);
  }

  public listarTurma() {
    return this.http.get<Turma[]>(this.url);
  }

  public cadastrarTurma(Turma: Turma) {
    return this.http.post(this.url, Turma);
  }

  public alterarTurma(Turma_atualizada: Turma, codigo_antigo: number) {
    return this.http.put(this.url + "/" + codigo_antigo, Turma_atualizada);
  }

  public excluirProfessor(turma_codigo: number) {
    return this.http.delete(this.url + "/" + turma_codigo);
  }
}
