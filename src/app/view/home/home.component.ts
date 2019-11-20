import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit() {

    var instance = M.Carousel.init({
   fullWidth: true
 });
    
    
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.carousel');
      var instances = M.Carousel.init(elems, );
  });

  // document.addEventListener('DOMContentLoaded', function() {
  //   var elems = document.querySelectorAll('.fixed-action-btn');
  //   var instances = M.FloatingActionButton.init(elems, {
  //     direction: 'right'
  //   });
  // });
  }

}
