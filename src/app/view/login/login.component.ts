import { AuthService } from './../../controller/servicos_login/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Variavel email que recebe do input email
  email: string;
  // Variavel senha que recebe do input senha
  senha: string;
  // Variavel que verifica se foi clicado em lembrar de mim ou não
  lembrar_de_mim: boolean = false;

  constructor(
    // Instanciando as classes de servico
    private loginServico: AuthService
  ) { }

  ngOnInit() {
  }

  // Funcao para tornar a variavel lembrar de mim conforme o checkbox está marcado
  lembrar_de_mim_funcao() {
    var chk_lembrar = <HTMLInputElement>document.getElementsByClassName("chk_lembrar")[0];
    chk_lembrar.checked ? this.lembrar_de_mim = true : this.lembrar_de_mim = false;
  }


  verificarLogin() {
    //
    this.loginServico.fazerLogin(this.email, this.senha, this.lembrar_de_mim);
    //
  }

}