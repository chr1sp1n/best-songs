import { Injectable, EventEmitter, Output } from '@angular/core';
import { BestSong } from '../_models/best-song';

@Injectable({
	providedIn: 'root'
})
export class YtPlayerService {

	@Output() fromList: EventEmitter<BestSong> = new EventEmitter();
	@Output() fromPlayer: EventEmitter<BestSong> = new EventEmitter();
	songs: BestSong[] = [];

	constructor() { }

	set(songs: BestSong[]){
		this.songs = [];
		songs.forEach( s => { this.songs.push(s); });
	}

	setFromList(song: BestSong) {
		console.log('LIST -> ' + song.status + ': ' + song.title);
		this.songs.forEach( (s,i) => {
			if(song.id_best_songs == s.id_best_songs){
				this.songs[i] = new BestSong(song);
				this.fromList.emit(this.songs[i]);
			}
		});
	}

	setFromPlayer(song: BestSong) {
		console.log('PLAYER -> ' + song.status + ': ' + song.title);
		this.songs.forEach( (s,i) => {
			if(song.id_best_songs == s.id_best_songs){
				this.songs[i] = new BestSong(song);
				this.fromPlayer.emit(this.songs[i]);
			}
		});
	}

	get(){
		return this.songs;
	}

}
