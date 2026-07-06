import { Component, Input } from '@angular/core';
import { SearchResult } from '../../models/SearchResult';

@Component({
  selector: 'app-result-card',
  imports: [],
  templateUrl: './result-card.html',
  styleUrl: './result-card.css',
})
export class ResultCard {
	@Input() result!: SearchResult;
	highlight(sentence: string, query: string): string {
  		const regex = new RegExp(`(${query})`, 'gi');
  		return sentence.replace(regex, '<strong>$1</strong>');
	}
	chapterCase(sentence: string){
		return sentence.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').slice(0, sentence.length-1);
	}
}
