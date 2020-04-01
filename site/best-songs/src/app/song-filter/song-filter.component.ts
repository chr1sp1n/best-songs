import { Component, OnInit } from '@angular/core';
import { BestSong } from '../_models/best-song';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BestSongsService } from '../_services/best-songs/best-songs.service';
import { Tag } from '../_models/tag';


@Component({
	selector: 'app-song-filter',
	templateUrl: './song-filter.component.html',
	styleUrls: ['./song-filter.component.scss']
})



export class SongFilterComponent implements OnInit {

	allTag: Tag = new Tag('All');
	filterText: string = '';

	constructor(
		public activeModal: NgbActiveModal,
		private modalService: NgbModal,
		private bestSongsService: BestSongsService,
	) {
		this.filterText = this.bestSongsService.filterText;
	}

	ngOnInit() {
		if(this.bestSongsService.tags.length > 0) return;
		let tags: string[] = [];
		this.bestSongsService.songs.forEach( (s: BestSong, i:number) => {
			s.songTags().forEach( (t:string) => {
				if(tags.indexOf(t) == -1) {
					tags.push(t);
					this.bestSongsService.tags.push( new Tag(t) );
				}
			});
		});
	}

	tags(){
		return this.bestSongsService.tags.sort(
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

	logic(state?: boolean){
		if(typeof state != 'undefined') {
			this.bestSongsService.filterLogic = state;
			this.filter(false);
		}
		return this.bestSongsService.filterLogic;
	}

	toggleTag(tag: Tag){
		tag.state = !tag.state;
		this.filter(false);
	}

	toggleAllTags(){
		this.allTag.state = !this.allTag.state;
		this.bestSongsService.tags.forEach( (t: Tag, i:number ) => {
			this.bestSongsService.tags[i].state = this.allTag.state;
		});
		this.filter(false);
	}

	filter(close?:boolean){

		if( this.filterText && this.filterText.trim().toString() != this.bestSongsService.filterText ){
			this.bestSongsService.filterText = this.filterText.trim().toString();
		}

		let tags = this.bestSongsService.tags.filter( t => { return t.state });
		this.bestSongsService.songs.forEach( (s: BestSong, i:number) => {

			this.bestSongsService.songs[i].visible = true;

			if(tags.length > 0){
				if(this.bestSongsService.filterLogic){ // AND
					this.bestSongsService.songs[i].visible = true;
					tags.forEach( (t:Tag) => {
						if( !s.songsHasTag(t.label) ) {
							this.bestSongsService.songs[i].visible = false;
						}
					});
				}else{ // OR
					this.bestSongsService.songs[i].visible = false;
					tags.forEach( (t: Tag) => {
						if( s.songsHasTag(t.label) ) {
							this.bestSongsService.songs[i].visible = true;
						}
					});
				}
			}

			if(this.bestSongsService.filterLogic || tags.length == 0){
				if( this.bestSongsService.filterText &&
					this.bestSongsService.filterText != '' &&
					this.bestSongsService.songs[i].title.toLowerCase().indexOf( this.bestSongsService.filterText.toLowerCase() ) == -1
				){
					this.bestSongsService.songs[i].visible = false;
				}
			}

		});

		if(typeof close == 'undefined' || close ) {
			this.activeModal.close();
		}
	}

	reset(){
		this.bestSongsService.songs.forEach( (s: BestSong, i:number) => {
			this.bestSongsService.songs[i].visible = true;
		});
		this.bestSongsService.tags.forEach ( (t: Tag, i: number ) => {
			this.bestSongsService.tags[i].state = false;
		});
		this.bestSongsService.filterText = null;
		this.filterText = this.bestSongsService.filterText;
		this.logic(false);
	}

}
