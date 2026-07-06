import { Injectable, signal} from '@angular/core';
import { GryffindorPreset, SlytherinPreset, RavenclawPreset, HufflepuffPreset  } from '../themes';
import { usePreset } from '@primeng/themes';
@Injectable({
  providedIn: 'root',
})
export class ThemesService {
	currentTheme = 'gryffindor';
	themeImage = signal<string>('gryffindor.png')

  setTheme(house: string) {
	this.themeImage.set(house+".png");
	const presets: any = {
    	gryffindor: GryffindorPreset,
    	slytherin:  SlytherinPreset,
    	ravenclaw:  RavenclawPreset,
    	hufflepuff: HufflepuffPreset,
  	};
  	usePreset(presets[house]);
    this.currentTheme = house;
  }

  changeTheme(){
	switch(this.currentTheme){
		case 'gryffindor':
			this.setTheme('hufflepuff');
			localStorage.setItem("theme", "hufflepuff");
			break;
		case 'hufflepuff':
			this.setTheme('ravenclaw');
			localStorage.setItem("theme", "ravenclaw");
			break;
		case 'ravenclaw':
			this.setTheme('slytherin');
			localStorage.setItem("theme", "slytherin");
			break;
		default:
			this.setTheme('gryffindor')
			localStorage.setItem("theme", "gryffindor");
	}
  }
}
