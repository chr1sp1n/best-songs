import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response } from '../../_models/response';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BestSong } from '../../_models/best-song';
import { environment } from '../../../environments/environment';
import { Tag } from '../../_models/tag';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';


@Injectable({
	providedIn: 'root'
})

export class BestSongsService {

	songs: BestSong[] = [];

	tags: Tag[] = [];
	filterLogic: boolean = false;
	filterText: string = null;

	@Output() fromNavBar: EventEmitter<BestSong> = new EventEmitter();
	@Output() fromList: EventEmitter<BestSong> = new EventEmitter();
	@Output() fromPlayer: EventEmitter<BestSong> = new EventEmitter();

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {

		let read = () =>{
			this.songs = [];
			this.read(null, 'title').subscribe(
				(resp: Response) => {
					resp = new Response(resp);
					if(resp.hasErrors()){
						// errors managment
						// this.openError(resp);
					}else{
						if(resp.data[0]){
							resp.data[0].forEach( song => {
								this.songs.push( new BestSong(song) );
								this.sort('title','asc');
							});
						}
					}
				}
			);
		}

		this.userService.userChange.subscribe( (state: boolean) => {
			if(state) read();
		});

		if(this.userService.state()) read();
	}

	create(song: BestSong):  Observable<Response>{
		return this.http.post<Response>(environment.apiBestSongs + '/create', song.getSqlItems() )
			.pipe(
				catchError( this.handleError('create', new Response()) )
			);
	}

	read( id_best_songs?: string, sorting?: string ): Observable<Response>{
		const params = new HttpParams()
			.set( 'id_best_songs', (id_best_songs)? id_best_songs.toString() : '0' )
			.set( 'sorting', (sorting)? sorting.toString() : null )

		return this.http.get<Response>(environment.apiBestSongs + '/read', { params: params })
			.pipe(
				catchError( this.handleError('read', new Response()) )
		  	);
	}

	update(song: BestSong): Observable<Response>{
		return this.http.patch<Response>( environment.apiBestSongs + '/update', song.getSqlItems() ) //params )
			.pipe(
				catchError( this.handleError('update', new Response()) )
			);
	}

	delete(song: BestSong):  Observable<Response>{
		const params = new HttpParams()
			.set( 'id_best_songs', song.id_best_songs.toString() );
		return this.http.delete<Response>(environment.apiBestSongs + '/delete', { params: params })
			.pipe(
				catchError( this.handleError('delete', new Response()) )
			);
	}

	sort(order:string, direction: string){

		let byTitle = ( a:BestSong, b:BestSong ) => {
			if ( a.songTitle() < b.songTitle() ){
				return (direction == 'asc')? -1 : 1;
			}else if ( a.songTitle() > b.songTitle() ){
				return (direction == 'asc')? 1 : -1;;
			}
			return 0;
		}

		let byArtist = ( a:BestSong, b:BestSong ) => {
			if ( a.songArtist() < b.songArtist() ){
				return (direction == 'asc')? -1 : 1;
			}else if ( a.songArtist() > b.songArtist() ){
				return (direction == 'asc')? 1 : -1;;
			}
			return 0;
		}

		let byRating = ( a:BestSong, b:BestSong ) => {
			if ( a.rating < b.rating ){
				return (direction == 'asc')? -1 : 1;
			}else if ( a.rating > b.rating ){
				return (direction == 'asc')? 1 : -1;;
			}
			return 0;
		}

		switch(order){
			case 'artist':
				this.songs.sort(byArtist);
				break;
			case 'rating':
				this.songs.sort(byRating);
				break;
			default:
				this.songs.sort(byTitle);
		}
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (response: any): Observable<T> => {
			result = response.error;
			return of(result as T);
		};
	}

}
