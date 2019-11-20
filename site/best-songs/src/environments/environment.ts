export const environment = {
	production: false,
	appName: 'Best Songs',
	// apiAuth: 'http://127.0.0.1:8180',
	// apiBestSongs: 'http://127.0.0.1:8180',
	apiAuth: 'https://api-bestsongs.chr1sp1n-dev.cloud',
	apiBestSongs: 'https://api-bestsongs.chr1sp1n-dev.cloud',
	OAUTH2_CLIENT_ID: 'AIzaSyCV0gvCkds32sTzFLJswjWxWi5c7PUON7g',
	YTAPI_URL: 'https://www.googleapis.com/youtube/v3/search',
	version: {
		major: 1,
		minor: 1,
		revision: 0
	},
	ytBaseUrl: 'https://www.youtube.com/watch?v=',
	social:{
		facebook:{
			ID_client: '260081744611303'
		},
		google:{
			ID_client: '876847483886-icf0hr9ho26peecchpj5t5a6acv3dgf4.apps.googleusercontent.com',
			client_secret: 'J34y_PvY7ah7bRDetOyeEOz2'
		},
		linkedin:{

		}
	}

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';	// Included with Angular CLI.
