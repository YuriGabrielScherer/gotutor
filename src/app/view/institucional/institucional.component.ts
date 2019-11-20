import { Component, OnInit } from '@angular/core';

import * as M from 'materialize-css';

@Component({
  selector: 'app-institucional',
  templateUrl: './institucional.component.html',
  styleUrls: ['./institucional.component.scss']
})
export class InstitucionalComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
      duration: 200,
      indicators: true,
      noWrap: true
    });

    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'right'
    });

    // // Código Botao Flutuando
    // document.addEventListener('DOMContentLoaded', function () {

    // });

    // // Código do Carousel
    // document.addEventListener('DOMContentLoaded', function () {

    // });


    var elems = document.querySelectorAll('.tabs');
    var instances = M.Tabs.init(elems)

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.materialboxed');
      var instances = M.Materialbox.init(elems);
    });


  }

}
