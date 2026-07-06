import { Component, OnInit } from '@angular/core';
import { ThemesService } from '../services/themes-service';
@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {


  constructor(public themeService: ThemesService) {}

  ngOnInit() {
  }

  changeTheme(){
	this.themeService.changeTheme();
  }
}
