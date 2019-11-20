import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  url: string = 'http://localhost:8090/api/enviar-email';

  constructor(private http: HttpClient) { }

  // Método Obter Dados Alunos
  public enviarEmail(email:String, aluno_nome:String, professor_nome:String) {
    return this.http.get(this.url + '/' + email + '/' + aluno_nome + '/' + professor_nome);
  }
}
