import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  

  //Variavel para esconder o Footer
  esconder = false;

  esconderFooter(){
    this.esconder = true;
  }

  mostrarFooter(){
    this.esconder = false;
  }

}
