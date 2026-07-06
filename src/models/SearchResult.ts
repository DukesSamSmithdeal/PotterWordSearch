export class SearchResult{
	title!: string;
	query!: string;
	content!: string;
	chapter!: string;
	constructor(title: string, chapter: string, content: string, query: string){
		this.title = title;
		this.query = query;
		this.content = content;
		this.chapter = chapter;
	}
}