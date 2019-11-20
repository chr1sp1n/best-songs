import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SongEditorComponent } from '../song-editor/song-editor.component';
import { SongFilterComponent } from '../song-filter/song-filter.component';
import { BestSong } from '../_models/best-song';
import { BestSongsService, UserService } from '../_services';
import { environment } from '../../environments/environment';
import { UserAreaComponent } from '../user-area/user-area.component';
import { User } from '../_models';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

	navBarCollapsed: boolean = true;
	playerControlsCollapsed: boolean = true;

	order: string = 'title';
	direction: string = 'asc';
	showState: object = {
		1:true,
		2:false,
		3:false,
	};

	constructor(
		private modalService: NgbModal,
		private bestSongsService: BestSongsService,
		private userService: UserService
	) {}

	ngOnInit() {
		this.showByState();
	}

	showStatus(state): void{
		this.showState[state] = !this.showState[state];
		
		let active: number = 0;
		for(let s in this.showState){
			if(this.showState[s]) ++active;
		}
		if(active < 1) {
			this.showState[state] = !this.showState[state];
			return;
		}		
		this.showByState();
	}

	appName(): string {
		return environment.appName;
	}

	version(): string{
		return environment.version.major + '.' + environment.version.minor + '.' + environment.version.revision;
	}

	open(what){
		var component;
		switch(what){
			case 'new':
				component = SongEditorComponent;
				break;
			case 'UserArea':
				component = UserAreaComponent;
				break;
			case 'SongFilter':
				component = SongFilterComponent;
				break;
			default:
		}

		if(component) this.openComponent(component);
	}

	setOrder(by){

		if(this.order == by){
			this.direction = (this.direction == 'asc')? 'desc' : 'asc';
		}else{
			this.direction = 'asc';
			this.order = by;
		}

		this.bestSongsService.sort(this.order, this.direction);

		this.navBarCollapsed = true;
	}

	getOrder(){
		return this.order + ' ' + this.direction;
	}

	getDirection(){
		return (this.direction == 'desc');
	}

	private openComponent(component){
		const modalRef = this.modalService.open( component, { size: 'lg', centered: true });
		modalRef.componentInstance.song = new BestSong();
		modalRef.result
			.then( (song?: BestSong) => {
				if(song) this.bestSongsService.fromNavBar.emit(song);
				this.navBarCollapsed = true;
			})
			.catch( (ret) => {} );
	}

	private showByState(){

		let user: User = this.userService.getUser();

		this.bestSongsService.songs.forEach( (s: BestSong, i:number) => {
			this.bestSongsService.songs[i].visible = false;
			if(this.showState[1]){			
				if(this.bestSongsService.songs[i].id_user == user.id_user){
					this.bestSongsService.songs[i].visible = true
				}			
			}
			if(this.showState[2]){
				if(this.bestSongsService.songs[i].id_user != user.id_user){ //&& this.bestSongsService.songs[i].state == 2){
					this.bestSongsService.songs[i].visible = true;
				}
			}
			if(this.showState[3]){
				if( this.bestSongsService.songs[i].id_user != user.id_user && this.bestSongsService.songs[i].state == 3){
					this.bestSongsService.songs[i].visible = true;
				}
			}			
		});	

	}
}
