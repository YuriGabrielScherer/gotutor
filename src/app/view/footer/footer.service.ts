import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  constructor( ){ }
  // Variavel de alteracao
  private mudarFooter = false;

  //EventEmitter
  @Output() mudar: EventEmitter<boolean> = new EventEmitter();

  // SetMudar() {
  //   this.mudarFooter = !this.mudarFooter;
  //   this.mudar.emit(this.mudarFooter);
  // }

  setFalse() {
    this.mudarFooter = false;
    this.mudar.emit(this.mudarFooter);
  }

  setTrue() {
    this.mudarFooter = true;
    this.mudar.emit(this.mudarFooter);
  }
}
