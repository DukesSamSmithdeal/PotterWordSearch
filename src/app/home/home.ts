import { Component, NgModule, signal} from '@angular/core';
import { Nav } from '../nav/nav';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { BookService } from '../services/book-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SearchResult } from '../../models/SearchResult';
import { ResultCard } from '../result-card/result-card';
@Component({
  selector: 'app-home',
  imports: [ResultCard, ProgressSpinnerModule,Nav,CheckboxModule,FormsModule,InputGroupModule,InputGroupAddonModule,ToolbarModule,IconFieldModule,InputIconModule,InputTextModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
	books: any[] =[
		{name: "The Philosopher's Stone", checked: true},
		{name: "The Chamber of Secrets", checked: true},
		{name: "The Prisoner of Azkaban", checked: true},
		{name: "The Goblet of Fire", checked: true},
		{name: "The Order of The Phoenix", checked: true},
		{name: "The Half Blood Prince", checked: true},
		{name: "The Deathly Hallows", checked: true}
	]

	constructor(public bookService: BookService){}
	isLoading = signal(false);
	results: SearchResult[] = [];
	showError = signal<boolean>(false);

	async search(query: string) {
  		this.isLoading.set(true);
		query = query.trim().toLowerCase();
  		try {
			if(query == ""){
				this.showError.set(true);
				return;
			}
			this.showError.set(false);
    		const results = await this.bookService.search(query, this.books);
			this.results = results;
  		} finally {
    		this.isLoading.set(false);
  		}
	}
}
