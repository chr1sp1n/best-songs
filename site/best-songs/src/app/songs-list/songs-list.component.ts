import { Component, OnInit, NgZone, isDevMode } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { BestSong } from '../_models/best-song';
import { BestSongsService } from '../_services/best-songs/best-songs.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SongEditorComponent } from '../song-editor/song-editor.component';
import { SongDeleteComponent } from '../song-delete/song-delete.component';
import { SongTagsComponent } from '../song-tags/song-tags.component';
import { SongYoutubeComponent } from '../song-youtube/song-youtube.component';

import { Response } from '../_models/response';
import { ErrorComponent } from '../error/error.component';
import { YtPlayerService } from '../yt-player/yt-player.service';
import { UserService } from '../_services';


@Component({
	selector: 'app-songs-list',
	templateUrl: './songs-list.component.html',
	styleUrls: ['./songs-list.component.scss'],
	providers: [ NgbRatingConfig ]
})
export class SongsListComponent implements OnInit {

	playerOpened: boolean = false;

	constructor(
		public ratingConfig: NgbRatingConfig,
		private bestSongsService: BestSongsService,
		private modalService: NgbModal,
		private zone: NgZone,
		private userService: UserService,
	) {
		ratingConfig.max = 5;
	}

	ngOnInit() {

		this.bestSongsService.fromPlayer.subscribe( (song: BestSong) => {
			// called on song status change
			if(song.status == 'ERROR'){
				this.bestSongsService.songs.forEach( (s, i) => {
					if(s.id_best_songs == song.id_best_songs){
						this.zone.run( () => {
							this.bestSongsService.songs[i].status = song.status;
						});
					}
				});
			}

			setTimeout( () => { this.openSong(song); }, 1);
		});

		this.bestSongsService.fromNavBar.subscribe( (song: BestSong) => {
			// called on create song
			setTimeout( () => { this.openSong(song); }, 1);
		});

	}

	open(what: string, song: BestSong) {
		var component;
		switch(what){
			case 'SongEditor':
				component = SongEditorComponent;
				break;
			case 'SongDelete':
				component = SongDeleteComponent;
				break;
			case 'SongTags':
				component = SongTagsComponent;
				break;
			case 'SongYoutube':
				component = SongYoutubeComponent;
				break;
			case 'song':
				this.openSong(song);
				return;
			default:
				return;
		}
		const modalRef = this.modalService.open(component, { size: 'lg', centered: true });
		modalRef.componentInstance.song = new BestSong(song);
		modalRef.result.then(
			(song: BestSong) => {
				this.bestSongsService.songs.forEach( (s,i) => {
					if(s.id_best_songs == song.id_best_songs){
						this.openSong(this.bestSongsService.songs[i]);
						console.log(this.bestSongsService.songs[i].status);
						this.bestSongsService.fromList.emit(this.bestSongsService.songs[i]);
					}
				});
			}
		).catch( () =>{} );
	}

	playPause(song: BestSong){
		this.bestSongsService.songs.forEach( (s, i) => {
			if( s.id_best_songs == song.id_best_songs ){
				if(this.bestSongsService.songs[i].status == 'PLAYING'){
					this.bestSongsService.songs[i].status = 'PAUSED';
				}else if(this.bestSongsService.songs[i].status == 'PAUSED'){
					this.bestSongsService.songs[i].status = 'PLAYING';
				}else{
					this.bestSongsService.songs[i].status = 'BUFFERING';
					this.playerOpened = true;
				}
				this.bestSongsService.fromList.emit( this.bestSongsService.songs[i] );
				if(isDevMode()) console.log('LIST -> ' + this.bestSongsService.songs[i].status + ': ' + this.bestSongsService.songs[i].title);
			}
		});
	}

	openError(data?: any){
		const modalRef = this.modalService.open(ErrorComponent, { size: 'lg', centered: true });
		modalRef.componentInstance.error = data;
	}

	songs(filtered: boolean = true): BestSong[]{
		return this.bestSongsService.songs.filter( s => { return (s.visible || !filtered) && s.state > 0});
	}

	rating(song: BestSong){
		this.bestSongsService.update(song).subscribe(
			(resp: any) => {
				resp = new Response(resp);
				if(resp.hasErrors()){
					// errors managment
					// this.openError( resp );
				}
			}
		)
	}

	share(song: BestSong){
		this.bestSongsService.songs.forEach( (s: BestSong, i: number) => {
			if(song.id_best_songs == s.id_best_songs){
				if( this.bestSongsService.songs[i].state == 1 ) {
					this.bestSongsService.songs[i].state = 2;
				}else if( this.bestSongsService.songs[i].state == 2 ){
					this.bestSongsService.songs[i].state = 3;
				}else{
					this.bestSongsService.songs[i].state = 1;
				}
				this.bestSongsService.update(this.bestSongsService.songs[i]).subscribe(
					(resp: any) => {
						resp = new Response(resp);
						if(resp.hasErrors()){
							// errors managment
						}
					}
				)
			}
		});
	}

	owner(song: BestSong){
		return song.id_user == this.userService.getUser().id_user;
	}

	private openSong(song){
		this.bestSongsService.songs.forEach( (s, i) => {
			if(s.id_best_songs == song.id_best_songs){
				if(this.bestSongsService.songs[i].status == 'PLAYING') {
					this.bestSongsService.songs[i].open = true;
				}else{
					this.bestSongsService.songs[i].open = !this.bestSongsService.songs[i].open;
				}
				this.scrollToSong(this.bestSongsService.songs[i]);
			}else{
				this.bestSongsService.songs[i].open = false;
			}
		});
	}

	private scrollToSong(song){
		let item = document.getElementById(song.domId());
		if(!item) return;
		let navbar = document.getElementById('navbar');
		let ytPlayer = document.getElementById('yt-player-wrapper');
		let top = item.offsetTop - window.pageYOffset;
		let viewportHeight = window.innerHeight - navbar.clientHeight - ytPlayer.clientHeight - item.clientHeight;

		// if item is outside of viewport scroll to item
		if( !(top > navbar.clientHeight && top < viewportHeight) ){
			window.scroll({
				top: item.offsetTop - ( (window.innerHeight - (item.offsetHeight * 2) ) / 2 ),
				behavior: 'smooth'
			});
		}
	}

}
