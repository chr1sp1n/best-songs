
export class YtThumbnail {
	default:{
		height: number,
		width: number,
		url: string
	};
	high:{
		height: number,
		width: number,
		url: string
	};
	medium:{
		height: number,
		width: number,
		url: string
	}

	constructor( obj ){
		for (let t in obj){

		}
	}
}

export class YtItem {
	videoId: string;
	description: string;
	publishedAt: Date;
	thumbnails: YtThumbnail;
	title: string;
}

export class Result {
	items: any[];
	snippet: YtItem[];
	nextPageToken: string;
	totalResults: number
}