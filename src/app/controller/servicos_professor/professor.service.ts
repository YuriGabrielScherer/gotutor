import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor } from 'src/app/model/bean_professor/professor';


@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  url:string='http://localhost:8090/api/professor';
  constructor(private http:HttpClient) { }

  public obterDadosProfessor(emailProfessor:String){
    return this.http.get<Professor>(this.url+'/'+emailProfessor);
  }

  public listarProfessores(){
    return this.http.get(this.url);
  }

  public cadastrarProfessor(professor:Professor){
    return this.http.post(this.url, professor);
  }

  public alterarProfessor(professor_atualizado:Professor, codigo_antigo:string){
    return this.http.put(this.url + "/" + codigo_antigo, professor_atualizado);
  }

  public excluirProfessor(professor:Professor){
    return this.http.delete(this.url+'/'+professor.codigo);
  }
}