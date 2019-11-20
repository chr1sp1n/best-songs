import { Component, OnInit, NgZone, isDevMode } from '@angular/core';
import { BestSong } from '../_models/best-song';
//import { bestSongsService } from './yt-player.service';
import { BestSongsService } from '../_services/best-songs/best-songs.service';
import { interval } from 'rxjs';
import { Title }     from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-yt-player',
	templateUrl: './yt-player.component.html',
	styleUrls: ['./yt-player.component.scss']
})
export class YtPlayerComponent implements OnInit {

	songs: BestSong[] = [];
	playingSong: BestSong = new BestSong();

	player: any;
	playerClosed: boolean = true;
	loop: boolean = true;
	shuffle: boolean = false;
	shuffleList: number[] = [];
	timeCouter: any;
	progress: string = '0:00';
	remaining: boolean = true;

	timerPercentage: any;
	percentage: number = 0;

	constructor(
		private bestSongsService: BestSongsService,
		private zone: NgZone,
		private titleService: Title
	) { }

	ngOnInit() {
		if(!window['YT']){
			window['onYouTubeIframeAPIReady'] = (e) => { this.makePlayer(); }
			var tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}

		this.bestSongsService.fromList.subscribe( ( song: BestSong ) => {
			console.log(song.status, this.playingSong.status);
			if(song.id_best_songs == this.playingSong.id_best_songs){
				this.playingSong.title = song.title;
				if(song.status == this.playingSong.status) return;
			}
			this.playerHandler(song);
		});
	}

	playPause(){
		if( this.playingSong.status == 'PLAYING' ){
			this.player.pauseVideo();
			//if(typeof this.timerPercentage != 'undefined') this.timerPercentage.unsubscribe();
		}else{
			this.player.playVideo();
			// this.timerPercentage = interval(1000).subscribe(() => {
			// 	this.getPrecentage();
			// });
		}
	}

	prev(){
		let index = this.getSongIndex(this.playingSong);
		let newIndex: number = undefined;
		this.setSongsStatus('ENDED');

		if(this.shuffle){
			this.shuffleList.forEach( (shuffleIndex: number, i: number) => {
				if( index == this.shuffleList[shuffleIndex] ) {
					for( let i = shuffleIndex - 1; i >= 0; --i){
						if( this.canPlay(this.bestSongsService.songs[this.shuffleList[i]]) ){
							newIndex = this.shuffleList[i];
							break;
						}
					}
					if(typeof newIndex == 'undefined'){
						for( let i = this.shuffleList.length - 1 ; i > shuffleIndex; --i){
							if( this.canPlay(this.bestSongsService.songs[this.shuffleList[i]]) ){
								newIndex = this.shuffleList[i];
								break;
							}
						}
					}
				}
			});
		}else{
			for( let i = index - 1; i >= 0; --i){
				if( this.canPlay(this.bestSongsService.songs[i]) ){
					newIndex = i;
					break;
				}
			}
			if(typeof newIndex == 'undefined'){
				for( let i = this.bestSongsService.songs.length - 1; i > index; --i){
					if( this.canPlay(this.bestSongsService.songs[i]) ){
						newIndex = i;
						break;
					}
				}
			}
		}

		if(typeof newIndex != 'undefined') {
			this.bestSongsService.songs[newIndex].status = 'BUFFERING';
			this.playerHandler(this.bestSongsService.songs[newIndex]);
		}
	}

	next(){
		let index = this.getSongIndex(this.playingSong);
		let newIndex: number = undefined;
		this.setSongsStatus('ENDED');

		if(this.shuffle){
			this.shuffleList.forEach( (shuffleIndex: number, i: number) => {
				if( index == this.shuffleList[shuffleIndex] ) {
					for( let i = shuffleIndex + 1; i < this.shuffleList.length; ++i){
						if( this.canPlay(this.bestSongsService.songs[this.shuffleList[i]]) ){
							newIndex = this.shuffleList[i];
							break;
						}
					}
					if(typeof newIndex == 'undefined'){
						for( let i = 0; i < shuffleIndex; ++i){
							if( this.canPlay(this.bestSongsService.songs[this.shuffleList[i]]) ){
								newIndex = this.shuffleList[i];
								break;
							}
						}
					}
				}
			});
		}else{
			for( let i = index + 1; i < this.bestSongsService.songs.length; ++i){
				if( this.canPlay(this.bestSongsService.songs[i]) ){
					newIndex = i;
					break;
				}
			}
			if(typeof newIndex == 'undefined'){
				for( let i = 0; i < index; ++i){
					if( this.canPlay(this.bestSongsService.songs[i]) ){
						newIndex = i;
						break;
					}
				}
			}
		}

		if(typeof newIndex != 'undefined') {
			this.bestSongsService.songs[newIndex].status = 'BUFFERING';
			this.playerHandler(this.bestSongsService.songs[newIndex]);
		}

	}

	shuffleToggle(){
		let shuffle = (array: number[]): number[] => {
			var currentIndex = array.length, temporaryValue, randomIndex;
			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		}

		this.shuffle = !this.shuffle;
		if(this.shuffle) {
			this.shuffleList = [];
			this.bestSongsService.songs.forEach( (s: BestSong, i: number) => {
				this.shuffleList.push(i);
			});
			this.shuffleList = shuffle(this.shuffleList);
		}
	}

	private canPlay(song: BestSong){
		return  song.visible &&
				song.youtube_url &&
				song.youtube_url != '';
	}

	private getSongIndex(song?: BestSong): number{
		let index:number = undefined
		this.bestSongsService.songs.forEach( (s: BestSong, i: number) => {
			if(s.id_best_songs == song.id_best_songs) index = i;
		});
		return index;
	}

	private playerHandler(song: BestSong){
		if( song.id_best_songs == this.playingSong.id_best_songs ){
			if( song.status == 'PLAYING' ){
				this.player.playVideo();
			}else if( song.status == 'PAUSED' ){
				this.player.pauseVideo();
			}else{
				this.player.stopVideo();
				this.playerClosed = true;
			}
		}else {
			this.bestSongsService.songs.forEach( (s: BestSong, i: number ) => {
				if( s.status == 'BUFFERING' ){
					this.setSongsStatus('STOPPED');
					this.playingSong = new BestSong(s);
					this.playerClosed = false;
					this.player.loadVideoById( this.playingSong.ytVideoId() );
				}
			});
		}
	}

	private setSongsStatus(status){
		if(this.playingSong.id_best_songs == 0) return;
		if(status == 'UNSTARTED' && this.playingSong.status == 'ERROR') {
			this.next();
		}
		this.bestSongsService.songs.forEach( (s, i) => {
			if(s.id_best_songs == this.playingSong.id_best_songs){
				this.playingSong.status = status;
				if(this.bestSongsService.songs[i].status != 'ERROR'){
					this.bestSongsService.songs[i].status = this.playingSong.status;
				}
				this.bestSongsService.fromPlayer.emit( this.bestSongsService.songs[i] );
				if(isDevMode()) console.log('PLAYER -> ' + this.bestSongsService.songs[i].status + ': ' + this.bestSongsService.songs[i].title);
				this.titleService.setTitle( s.songTitle() + ' - ' + s.songArtist() + ' | ' + environment.appName);
			}
		});
	}

	private makePlayer(){
		if(!window['YT']){
			this.setSongsStatus('ERROR');
			return;
		}
		this.player = new window['YT'].Player( 'yt-player', {
			height: '100%',
			width: '100%',
			playerVars: { showinfo: 0 },
			events: {
				'onStateChange': () => {
					switch(this.player.getPlayerState()){
							case -1:
							this.setSongsStatus('UNSTARTED');
							break;
						case window['YT'].PlayerState.ENDED:
							this.setSongsStatus('ENDED');
							if(this.loop) {
								this.next();
							}else{
								this.playerClosed = true;
							}
							this.zone.run( () => { if(this.timeCouter) this.timeCouter.unsubscribe() });
							break;
						case window['YT'].PlayerState.PLAYING:
							this.setSongsStatus('PLAYING');
							this.zone.run( () => { this.progress = this.getTime(); });
							this.timeCouter = interval(500).subscribe(() => {
								this.zone.run( () => {
									this.progress = this.getTime();
								});
								this.getPrecentage();
							});
							break;
						case window['YT'].PlayerState.PAUSED:
							this.setSongsStatus('PAUSED');
							this.zone.run( () => { if(this.timeCouter) this.timeCouter.unsubscribe() });
							break;
						case window['YT'].PlayerState.BUFFERING:
							this.setSongsStatus('BUFFERING');
							break;
						case window['YT'].PlayerState.CUED:
							this.setSongsStatus('CUED');
							break;
						default:
							this.setSongsStatus('unknow');
					}
				},
				'onError': (e) => {
					this.setSongsStatus('ERROR');
				},
				'onReady': (e) => {
					this.setSongsStatus('READY');
				}
			}
		});
	}

	private getTime(){
		let time  = (this.remaining) ? this.player.getDuration() - this.player.getCurrentTime() : this.player.getCurrentTime();
		let minutes = Math.floor(time / 60);
		let seconds = Math.floor(time - (minutes * 60));
		return ((this.remaining)?'-':'') + minutes + ':' + ((seconds < 10) ? '0' + seconds : seconds);
	}

	private getPrecentage(){
		let unit = 100 / this.player.getDuration();
		this.percentage = this.player.getCurrentTime() * unit;
	}
}
