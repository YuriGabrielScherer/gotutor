import { AuthService } from './../controller/servicos_login/auth.service';
import { Injectable } from '@angular/core';

import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Verificando se o usuário pode ativar tal rota
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    console.log('AuthGuard');

    return this.verificarAcesso();
  }

  // Metodo que acessa o Serviço de Login para saber se está ou não logado
  private verificarAcesso() {
    if (this.authService.getUsuarioEstaAutenticado()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
