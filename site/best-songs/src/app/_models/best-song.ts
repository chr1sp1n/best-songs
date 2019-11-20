export class BestSong {
	id_best_songs: number = 0;
	id_user: number = 0;
	title: string = '';
	rating: number = 0;
	tags: string = '';
	youtube_url: string = '';
	data: any = null;
	creation_date_time: string = null;
	last_edit: string = null;
	state: number = 1;
	userName: string = null;

	open: boolean = false;
	artist: string = '';
	playerStatus: string;
	status: string = 'STOPPED';
	visible: boolean = true;

	constructor ( obj? ){
		if(obj){
			this.id_best_songs = obj.id_best_songs;
			this.id_user = obj.id_user;
			this.title = obj.title;
			this.rating = obj.rating;
			this.tags = obj.tags;
			this.youtube_url = obj.youtube_url;
			this.creation_date_time = obj.creation_date_time
			this.state = (obj.state)? obj.state : 1;
			this.userName = obj.userName;
			this.open = obj.open;
			this.status = obj.status;
		}
	}

	private capitalize(text: string){
		var words = text.toLowerCase().split(' ');
		if(words.length>0){
			text = '';
			words.forEach( word => {
				if(word[0]) text = text + word[0].toUpperCase() + word.slice(1) + ' ';
			});
		}
		return text.trim();
	}

	songTitle(raw?: boolean){
		var data = this.title.split(' - ');
		var title = (data.length>1)? data[1] : this.title;
		return (raw)? title : this.capitalize(title);
	}

	songArtist(raw?: boolean){
		var data = this.title.split(' - ');
		var artist = (data.length>1)? data[0] : this.title;
		return (raw)? artist : this.capitalize(artist);
	}

	songTags(){
		var tagsRaw: string[] = this.tags.split(',');
		var tags: string[] = [];
		tagsRaw.forEach( (tag, i) => {
			if( tag.trim() != '' ) tags.push(tag.trim());
		});
		return tags;
	}

	songHasTags(){
		var tags = this.songTags();
		return (tags.length > 0);
	}

	songsHasTag(tag: string):boolean {
		let tags = this.songTags();
		return (tags.indexOf(tag) > -1);
	}

	domId(){
		return 'item-' + this.id_best_songs;
	}

	domIdDet(){
		return 'item-det-' + this.id_best_songs;
	}

	ytVideoId(): string{
		let videoId = null;
		let start = this.youtube_url.indexOf('watch?v=');
		if( start > -1 ) videoId = this.youtube_url.substr(start + 8);
		return videoId;
	}

	getSqlItems(){
		return{
			id_best_songs: this.id_best_songs,
			title: this.title,
			rating: this.rating,
			tags: this.tags,
			youtube_url: this.youtube_url,
			data: this.data,
			state: this.state
		}
	}
}