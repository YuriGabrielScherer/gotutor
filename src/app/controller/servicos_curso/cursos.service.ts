import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Curso } from './../../model/bean_curso/curso';


@Injectable({
  providedIn: 'root'
})
export class CursosService {

  url: string = 'http://localhost:8090/api/curso';

  constructor(private http: HttpClient) { }

  public obterDadosCurso(id_curso: number) {
    return this.http.get(this.url + '/' + id_curso);
  }

  // Listar cursos de um professor especifico
  public listarCursos(email_professor: string) {
    return this.http.get<Curso[]>(this.url + '/listar/' + email_professor);
  }

  public cadastrarCurso(Curso: Curso) {
    return this.http.post(this.url, Curso);
  }

  public alterarCurso(Curso_atualizado: Curso) {
    return this.http.put(this.url, Curso_atualizado);
  }

  public excluirCurso(id_curso: number) {
    return this.http.delete(this.url + '/' + id_curso);
  }

  public verificaCurso(curso: Curso) {
    return this.http.get<Boolean>(this.url + '/verifica/' + curso.codigo);
  }
}
