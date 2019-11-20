import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Aula } from './../../model/bean_aula/aula';

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  
  url:string='http://localhost:8090/api/aula';
  
  constructor(private http:HttpClient) { }

  public obterDadosAula(id_aula:string){
    return this.http.get(this.url+'/'+id_aula);
  }

  // Listar todas as aulas vinculadas a um professor especifico
  public obterAulaProfessor(emailProfessor: string) {
    return this.http.get<Aula[]>(this.url + '/professor/' + emailProfessor);
  }
  
  // Listar todas as aulas vinculadas a um aluno especifico
  public obterAulaAluno(emailAluno: string) {
    return this.http.get<Aula[]>(this.url + '/aluno/' + emailAluno);
  }

  // Listar aulas Professor e Aluno
  public getAulaAlunoProf(emailProfessor : String, emailAluno : String){
    return this.http.get<Aula[]>(this.url + '/professoraluno/' + emailProfessor + '/' + emailAluno )
  }

  public listarAulas(){
    return this.http.get(this.url);
  }

  public cadastrarAula(Aula:Aula, NomesAlunos:string, duracaoAula: number){
    return this.http.post(this.url + '/' + NomesAlunos + '/' + duracaoAula, Aula);
  }

  public alterarAula(Aula_atualizada:Aula, id_antigo:string, title: string){
    return this.http.put(this.url + "/" + id_antigo + "/" + title, Aula_atualizada);
  }

  public excluirAula(aula_codigo:string){
    return this.http.delete(this.url+'/'+aula_codigo);
  }

}
