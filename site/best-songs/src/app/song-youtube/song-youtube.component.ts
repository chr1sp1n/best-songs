import { Component, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { BestSong } from '../_models/best-song';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BestSongsService } from '../_services/best-songs/best-songs.service';
import { Response } from '../_models/response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from '../error/error.component';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-song-youtube',
	templateUrl: './song-youtube.component.html',
	styleUrls: ['./song-youtube.component.scss']
})
export class SongYoutubeComponent implements OnInit {

	constructor(
		public activeModal: NgbActiveModal,
		private bestSongsService: BestSongsService,
		private modalService: NgbModal
	) {}

	song: BestSong;
	formData: BestSong;

	ngOnInit() {
		this.formData = new BestSong(this.song);
		this.search();
	}

	query: string = null;
	search(){
		this.query = (this.formData.artist)? this.formData.artist + ' - ' + this.formData.title: this.formData.title;
	}

	onVideoIdChange(videoId){
		this.save(videoId);
	}

	save(videoId: string):void {
		var editSong  = new BestSong(this.song);
		editSong.youtube_url = environment.ytBaseUrl + videoId;

		if(editSong.id_best_songs == 0){
			this.activeModal.close(editSong);
		}else{
			this.bestSongsService.update(editSong).subscribe(
				(resp: any) => {
					resp = new Response(resp);
					if(resp.hasErrors()){
						// this.openError(resp);
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
