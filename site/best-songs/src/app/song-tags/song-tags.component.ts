import { Component, OnInit, Input } from '@angular/core';
import { BestSong } from '../_models/best-song';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BestSongsService } from '../_services/best-songs/best-songs.service';
import { Response } from '../_models/response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from '../error/error.component';
import { Tag } from '../_models/tag';

@Component({
	selector: 'app-song-tags',
	templateUrl: './song-tags.component.html',
	styleUrls: ['./song-tags.component.scss']
})
export class SongTagsComponent implements OnInit {

	@Input() song: BestSong;

	constructor(
		public activeModal: NgbActiveModal,
		private bestSongsService: BestSongsService,
		private modalService: NgbModal
	) {}

	newTagsList: string[] = [];
	tagInput: string;
	tags: Tag[] = [];

	ngOnInit():void {
		this.newTagsList = this.song.songTags();

		let tags: string[] = [];
		this.bestSongsService.songs.forEach( (s:BestSong, i:number) => {
			s.songTags().forEach( (t:string) => {
				if(tags.indexOf(t) == -1) {
					tags.push(t);
					this.tags.push( new Tag(t) );
				}
			});
			if(i == this.bestSongsService.songs.length - 1 ){
				console.log(this.tags);
				this.tags.sort(
					( a:Tag, b:Tag ) => {
						if ( a.label < b.label ){
							return -1;
						}else if ( a.label > b.label ){
							return  1;
						}
						return 0;
					}
				);
			}
		})

	}

	tagAdded(tag: string){
		return this.newTagsList.indexOf(tag) > -1;
	}

	addTags(tag?: string):void {

		if(tag){
			if( this.newTagsList.indexOf(tag) == -1 ){
				this.newTagsList.push(tag);
			}
		}else{
			let newTags = this.tagInput.split(',');
			let newTagsList = newTags;
			newTagsList.forEach( (tag: string , i: number) => {
				newTagsList[i] = tag.trim();
			});

			this.newTagsList = [];

			this.song.songTags().forEach( (tag: string , i: number) => {
				if( this.newTagsList.indexOf(tag) == -1 ){
					this.newTagsList.push(tag);
				}
			});

			newTagsList.forEach( (tag: string , i: number) => {
				if( this.newTagsList.indexOf(tag) == -1 ){
					this.newTagsList.push(tag);
				}
			});
		}

	}

	removeTag(tag: string):void {
		var index = this.newTagsList.indexOf(tag);
		if( index > -1 ) this.newTagsList.splice(index, 1);

		var newTagInput = '';
		this.newTagsList.forEach( (tag) => {
			if(this.tagInput.indexOf(tag) > -1) newTagInput = newTagInput + tag.trim() + ', ';
		});
		this.tagInput = newTagInput.substring(0, newTagInput.length-2);
	}

	save():void {
		var editSong  = new BestSong(this.song);
		editSong.tags = '';

		this.newTagsList.forEach( (tag) => {
		 	editSong.tags = editSong.tags + tag.trim() + ',';
		});
		editSong.tags = editSong.tags.substring(0, editSong.tags.length-1);

		this.bestSongsService.update(editSong).subscribe(
			(resp: any) => {
				resp = new Response(resp);
				if(resp.hasErrors()){
					//this.openError(resp);
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

	openError(data?: any){
		const modalRef = this.modalService.open(ErrorComponent, { size: 'lg', centered: true });
		modalRef.componentInstance.error = data;
	}
}
