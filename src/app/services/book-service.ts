import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { Book } from '../../models/book';
import nlp from 'compromise';
import { isPlatformBrowser } from '@angular/common';
import { SearchResult } from '../../models/SearchResult';
@Injectable({
  providedIn: 'root',
})
export class BookService {
	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
	private db: IDBDatabase | null = null;
	count = signal<number>(0);

  async getDB(): Promise<IDBDatabase> {
	    if(!isPlatformBrowser(this.platformId)){
      throw new Error('IndexedDB is not available on the server');
    }
    if(this.db) return this.db; // 👈 reuse existing connection

    return new Promise((resolve, reject) => {
		console.log("test")
      const request = indexedDB.open('BooksDB', 1);

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const store = db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
      };

      request.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result; // 👈 save it
        resolve(this.db);
      };

      request.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
    });
  }

async saveBook(book: Book) {
  const db = await this.getDB();
  const sentences = this.splitSentences(book.contents); // 👈 no compromise

  return new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readwrite');
    const store = tx.objectStore('books');
    sentences.forEach((sentence: string, index: number) => {
      store.add({ title: book.title, sentence: sentence.trim(), index });
    });
    tx.oncomplete = () => resolve(null);
    tx.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

  async getBooks() {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readonly');
    const store = tx.objectStore('books');
    const request = store.getAll();
    request.onsuccess = (e) => resolve((e.target as IDBRequest).result);
    request.onerror = (e) => reject((e.target as IDBRequest).error);
  	});
  }
  async clearDB() {
  const db = await this.getDB();
  console.log("clearing")
  return new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readwrite');
    const store = tx.objectStore('books');
    const request = store.clear();
    request.onsuccess = () => resolve(null);
    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });
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
    .filter(s => s.length > 10);
}
currentc = ""

async search(query: string, books: any[]): Promise<SearchResult[]> {
  const db = await this.getDB();
  const matches: any[] = [];
  this.count.set(0)

  // step 1 — collect all matches with cursor
  await new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readonly');
    const store = tx.objectStore('books');
    const request = store.openCursor();

    request.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest).result;
      if(cursor) {
        const sentence = cursor.value.sentence as string;
        const title = cursor.value.title as string;
        const id = cursor.value.id as number;

        if(sentence.match(new RegExp("CHAPTER", 'g'))){
          this.currentc = sentence;
        }

        const found = sentence.toLowerCase().match(new RegExp(query.toLowerCase(), 'g'));
        if(found && books.some(b => b.name === cursor.value.title && b.checked === true)) {
		  this.count.update(c => c + 1);
          matches.push({ title, sentence, id, chapter: this.currentc });
        }
        cursor.continue();
      } else {
        resolve(null); // cursor done, transaction closed
      }
    };

    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });

  // step 2 — now fetch surrounding sentences (transaction is closed, safe to open new ones)
const results: SearchResult[] = await Promise.all(
  matches.map(async match => {
    let before1 = await this.getSentenceById(match.id - 1);
    let after1 = await this.getSentenceById(match.id + 1);
	if(before1.includes("CHAPTER")) before1 = "";
	if(after1.includes("CHAPTER")) after1 = "";


    return new SearchResult(match.title, match.chapter, before1+ " " + match.sentence+ " " +after1, query);
  })
);

  return results;
}

async getSentenceById(id: number): Promise<string> {
  const db = await this.getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readonly');
    const store = tx.objectStore('books');
    const request = store.get(id);  // 👈 direct lookup by primary key, very fast

    request.onsuccess = (e) => {
      const record = (e.target as IDBRequest).result;
      resolve(record?.sentence || '');
    };
    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}
}
