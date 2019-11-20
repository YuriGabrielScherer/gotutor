import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortaService {

  constructor() { }

  public porta(){
    return '8090';
  }
}
