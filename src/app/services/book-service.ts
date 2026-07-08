import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { Book } from '../../models/book';
import nlp from 'compromise';
import { isPlatformBrowser } from '@angular/common';
import { SearchResult } from '../../models/SearchResult';
@Injectable({
  providedIn: 'root',
})
export class BookService {
	count = signal<number>(0);
	allBooks: any = [];


	saveBook(book: Book){
		const sentences = this.splitSentences(book.contents);
		this.allBooks.push({title: book.title, sentences: sentences});
	}



	splitSentences(content: string): string[] {
	return content
		.replace(/\r\n|\r|\n/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/\.\s\.\s\./g, '<ELLIPSIS>')
		.replace(/\.\.\./g, '<ELLIPSIS>')
		.replace(/(\b(Mr|Mrs|Dr|Prof|Sr|Jr|St|Vol|vs|etc|approx)\b\.)/g, '$1<STOP>')
		.split(/(?<=[.!?]["”'']?)\s+/)
		.map(s => s.replace(/<STOP>/g, '.').replace(/<ELLIPSIS>/g, '...').trim())
	}
currChapter = ""

	search(query: string, books: any[]): SearchResult[] {
		const matches: any[] = [];
		this.count.set(0)
		for(let book of this.allBooks){
			//main loop

			//search only the selected books
			if(books.some(b => b.name === book.title && b.checked === true)){
				book.sentences.forEach((sentence: string) =>{
					if(sentence.match(new RegExp("CHAPTER", 'g'))){
						this.currChapter = sentence;
					}
					//found a match
					const found = sentence.toLowerCase().match(new RegExp(query.toLowerCase(), 'g'));
					if (found) {
  						this.count.update(c => c + found.length);
						if(matches.length < 101){
							const sentenceBefore = book.sentences.indexOf(sentence) -1;
							const sentenceAfter = book.sentences.indexOf(sentence) +1;
							const content = book.sentences[sentenceBefore] + " " + sentence + " " + book.sentences[sentenceAfter];
							matches.push(new SearchResult(book.title, this.toTitleCase(this.currChapter), content, query))
						}
					}
				})
			}
		}
		return matches;
	}

	toTitleCase(str: string): string {
		return str
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ').slice(0, str.length);
}
}