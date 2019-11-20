import { Component, OnInit, Input } from '@angular/core';
import { BestSong } from '../_models/best-song';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BestSongsService } from '../_services';
import { Response } from '../_models/response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from '../error/error.component';

@Component({
	selector: 'app-song-delete',
	templateUrl: './song-delete.component.html',
	styleUrls: ['./song-delete.component.scss']
})
export class SongDeleteComponent implements OnInit {

	@Input() song: BestSong;

	constructor(
		public activeModal: NgbActiveModal,
		private bestSongsService: BestSongsService,
		private modalService: NgbModal
	) {}

	ngOnInit() {
	}

	delete(){
		this.bestSongsService.delete(this.song).subscribe(
			(resp: any) => {
				resp = new Response(resp);
				if(resp.hasErrors()){
					// errors managment
					// this.openError(resp);
				}else{
					this.song.state = 0;
					this.song.status = 'STOPPED';
					this.bestSongsService.songs.forEach( (s:BestSong, i:number) => {
						if(s.id_best_songs == this.song.id_best_songs){
							this.bestSongsService.songs[i].status = 'STOPPED';
							this.bestSongsService.songs[i].state = 0;
						}
					});
					this.activeModal.close(this.song);
				}
			}
		)
	}

	openError(data?: any){
		const modalRef = this.modalService.open(ErrorComponent, { size: 'lg', centered: true });
		modalRef.componentInstance.error = data;
	}
}
