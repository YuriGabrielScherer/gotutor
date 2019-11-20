import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PortaService } from './../porta/porta.service';
import { Pagamento } from './../../model/bean_pagamento/pagamento';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  constructor(
    private http: HttpClient,
    private PortaService: PortaService
    ) { }

  // URL do Banco Postman.
  url: string = 'http://localhost:'+this.PortaService.porta()+'/api/pagamento';

  // Lista pagamentos de aulas de determinado professor, pode ou não ser vinculado a algum aluno
  public obterPagamentosProfessor(codigo_professor: string, codigo_aluno: string) {
    return this.http.get<Pagamento[]>(this.url + '/professor/' + codigo_professor + '/' + codigo_aluno);
  }

  // Lista pagamentos de aulas de determinado aluno, pode ou não ser vinculado a algum professor
  public obterPagamentosAluno(codigo_aluno: string, codigo_professor: string) {
    return this.http.get<Pagamento[]>(this.url + '/aluno/' + codigo_aluno + '/' + codigo_professor);
  }

  public obterPagamento(codigo_pagamento: string) {
    return this.http.get(this.url + '/' + codigo_pagamento);
  }

  public cadastrarPagamento(Pagamento: Pagamento) {
    return this.http.post(this.url, Pagamento);
  }

  public alterarPagamento(Pagamento_novo: Pagamento) {
    return this.http.put(this.url, Pagamento_novo);
  }

  public excluirPagamento(codigo_pagamento: string) {
    return this.http.delete(this.url + '/' + codigo_pagamento);
  }
}
