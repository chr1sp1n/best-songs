import { Component, OnInit, Input } from '@angular/core';
import { BestSong } from '../_models/best-song';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BestSongsService } from '../_services';
import { Response } from '../_models/response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from '../error/error.component';
import { SongYoutubeComponent } from '../song-youtube/song-youtube.component';

@Component({
	selector: 'app-song-editor',
	templateUrl: './song-editor.component.html',
	styleUrls: ['./song-editor.component.scss']
})
export class SongEditorComponent implements OnInit {

	@Input() song: BestSong;

	formData: BestSong;
	isNew: boolean = true;

	constructor(
		public activeModal: NgbActiveModal,
		private bestSongsService: BestSongsService,
		private modalService: NgbModal
	) {}

	ngOnInit() {
		this.formData = new BestSong(this.song);
		this.isNew = this.formData.id_best_songs == 0;
		this.formData.artist = this.song.songArtist(true);
		this.formData.title = this.song.songTitle(true);
	}

	modalTitle(): string{
		return (this.song.id_best_songs == 0)? 'Add song' : 'Edit song';
	}

	capitalize(what: string){
		var text = '';
		if(what == 'title') text = this.formData.title;
		if(what == 'artist') text = this.formData.artist;

		var words = text.toLowerCase().split(' ');
		if(words.length>0){
			text = '';
			words.forEach( word => {
				if(word[0]) text = text + word[0].toUpperCase() + word.slice(1) + ' ';
			});
		}

		if(what == 'title') this.formData.title = text.trim();
		if(what == 'artist') this.formData.artist = text.trim();
	}

	ytSearch(){
		const modalRef = this.modalService.open(SongYoutubeComponent, { size: 'lg', centered: true });
		let youTubeSearch = new BestSong(this.formData);
		youTubeSearch.title = this.formData.artist + ' - ' + this.formData.title;
		modalRef.componentInstance.song = new BestSong(youTubeSearch);
		modalRef.result
			.then( (song: BestSong) => {
				this.formData.youtube_url = song.youtube_url;
			})
			.catch( (ret) => { console.error(ret) } );
	}

	save(){
		var editSong  = new BestSong(this.formData);
		editSong.title = this.formData.artist + ' - ' + this.formData.title;

		if(editSong.id_best_songs == 0){
			this.bestSongsService.create(editSong).subscribe(
				(resp: any) => {
					resp = new Response(resp);
					if(resp.hasErrors()){
						// errors managment
						this.activeModal.dismiss();
						return;
					}
					let song = new BestSong(resp.data);
					this.bestSongsService.songs.push(song);
					this.activeModal.close(song);
				}
			)
		}else{
			this.bestSongsService.update(editSong).subscribe(
				(resp: any) => {
					resp = new Response(resp);
					if(resp.hasErrors()){
						// errors managment
						// this.openError(resp);
						this.activeModal.dismiss();
						return;
					}
					let song = new BestSong(resp.data);
					song.status = editSong.status;
					this.bestSongsService.songs.forEach( (s:BestSong, i:number) => {
						if(s.id_best_songs == song.id_best_songs){
							this.bestSongsService.songs[i] = song;
						}
					});
					this.activeModal.close(song);
				}
			)
		}
	}

	openError(data?: any){
		const modalRef = this.modalService.open(ErrorComponent, { size: 'lg', centered: true });
		modalRef.componentInstance.error = data;
	}
}
