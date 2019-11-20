import { Component, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Result } from './result';
import { ErrorComponent } from '../error/error.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-yt-search',
	templateUrl: './yt-search.component.html',
	styleUrls: ['./yt-search.component.scss']
})
export class YtSearchComponent implements OnInit {

	@Input() query: string;
	@Output() videoIdChange = new EventEmitter<string>();
	currentResult: Result;

	private OAUTH2_CLIENT_ID: string = environment.OAUTH2_CLIENT_ID;
	private YTAPI_URL: string = environment.YTAPI_URL;

	constructor(
		private http: HttpClient,
		private modalService: NgbModal
	) {}

	ngOnInit() {
		this.currentResult = new Result();
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}){
		for (let propName in changes) {
			let changedProp = changes[propName];
			if(propName == 'query' && changedProp.currentValue) {
				this.search();
				break;
			}
		}
	}

	hasResults(){
		if(this.currentResult.items && this.currentResult.items.length > 0) return true;
		return false;
	}

	search(more?: boolean){
		let nextPageToken = null;
		if(more) nextPageToken = (this.currentResult && this.currentResult.nextPageToken)? this.currentResult.nextPageToken : '';
		this.ytSearch(this.query, nextPageToken).subscribe(
			(resp: Result) => {
				//console.log(resp);
				this.currentResult.nextPageToken = resp.nextPageToken;
				if(!this.currentResult.items || !more) this.currentResult.items = [];
				resp.items.forEach( (item) => {
					this.currentResult.items.push(item);
				});
			}
		);
	}

	select(videoId: string){
		this.videoIdChange.emit(videoId);
	}

	openError(data?: any){
		const modalRef = this.modalService.open(ErrorComponent, { size: 'lg', centered: true });
	}

	private ytSearch(query: string, nextPageToken?: string):  Observable<Result>{

		let params = new HttpParams()
			.set( 'key', this.OAUTH2_CLIENT_ID )
			.set( 'part', 'snippet,id' )
			.set( 'q', query )
			.set( 'maxResults', '10')
			.set( 'order', 'relevance')
			.set( 'pageToken', (nextPageToken)? nextPageToken : '');

		return this.http.get<Result>( this.YTAPI_URL, { params: params } )
			.pipe(
				catchError( this.handleError('read', new Result()) )
		  	);
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			this.openError(error);
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// TODO: better job of transforming error for user consumption
			console.log(`${operation} failed: ${error.message}`);
			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

}
