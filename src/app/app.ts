import { Component, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookService } from './services/book-service';
import { Book } from '../models/book';
import { ThemesService } from './services/themes-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
	bookSources: any[] = [
		{title: "The Philosopher's Stone", source: "books/philosophersStone.txt"},
		{title: "The Chamber of Secrets", source: "books/chamberOfSecrets.txt"},
		{title: "The Prisoner of Azkaban", source: "books/prisonerOfAzkaban.txt"},
		{title: "The Goblet of Fire", source: "books/gobletOfFire.txt"},
		{title: "The Order of The Phoenix", source: "books/orderOfThePheonix.txt"},
		{title: "The Half Blood Prince", source: "books/halfBloodPrince.txt"},
		{title: "The Deathly Hallows", source: "books/deathlyHallows.txt"},
	
	];
  	constructor(private readonly themeService: ThemesService, private readonly bookService: BookService, @Inject(PLATFORM_ID) private platformId: Object){}
	ngOnInit() {
		let currentTheme = localStorage.getItem('theme');
		if(currentTheme){
			this.themeService.setTheme(currentTheme)
		}
		else{
			this.themeService.setTheme('gryffindor');
			localStorage.setItem("theme", 'gryffindor')
		}
		this.loadBooksIntoDb();
		
	}

	loadBooksIntoDb(){
		this.bookSources.forEach(async source =>{
			const title = source.title;
			const response = await fetch(source.source);
			const contents = await response.text();
			this.bookService.saveBook(new Book(title, contents));
		});
	}
}
