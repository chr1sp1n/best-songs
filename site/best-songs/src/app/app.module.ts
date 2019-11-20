import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SongsListComponent } from './songs-list/songs-list.component';

import { HttpClientModule, HTTP_INTERCEPTORS }		from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { JwtModule } from '@auth0/angular-jwt';

import { SongEditorComponent } from './song-editor/song-editor.component';
import { SongDeleteComponent } from './song-delete/song-delete.component';
import { SongTagsComponent } from './song-tags/song-tags.component';
import { SongYoutubeComponent } from './song-youtube/song-youtube.component';
import { FormsModule }	 from '@angular/forms';
import { YtSearchComponent } from './yt-search/yt-search.component';
import { ErrorComponent } from './error/error.component';
import { YtPlayerComponent } from './yt-player/yt-player.component';
import { SongFilterComponent } from './song-filter/song-filter.component';

import { environment } from '../environments/environment';
import {
		SocialLoginModule,
		AuthServiceConfig,
		GoogleLoginProvider,
		FacebookLoginProvider,
		LinkedinLoginProvider
} from "angular-6-social-login-v2";
import { UserAreaComponent } from './user-area/user-area.component';
import { UserAuthComponent } from './user-auth/user-auth.component';


export function getAuthServiceConfigs() {
	let config = new AuthServiceConfig(
		[
			// {
			// 	id: FacebookLoginProvider.PROVIDER_ID,
			// 	provider: new FacebookLoginProvider(environment.social.facebook.ID_client)
			// },
			{
				id: GoogleLoginProvider.PROVIDER_ID,
				provider: new GoogleLoginProvider(environment.social.google.ID_client)
			},
			// {
			// 	id: LinkedinLoginProvider.PROVIDER_ID,
			// 	provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
			// },
		]
	);
	return config;
	}


@NgModule({
	declarations: [
		AppComponent,
		NavBarComponent,
		SongsListComponent,
		SongEditorComponent,
		SongDeleteComponent,
		SongTagsComponent,
		SongYoutubeComponent,
		YtSearchComponent,
		ErrorComponent,
		YtPlayerComponent,
		SongFilterComponent,
		UserAreaComponent,
		UserAuthComponent
	],
	imports: [
		BrowserModule,
		NgbModule,
		HttpClientModule,
		FormsModule,
		SocialLoginModule
	],
	providers: [
		{
			provide: AuthServiceConfig,
			useFactory: getAuthServiceConfigs
		},
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
	],
	bootstrap: [
		AppComponent
	],
	entryComponents: [
		SongEditorComponent,
		SongDeleteComponent,
		SongTagsComponent,
		SongYoutubeComponent,
		ErrorComponent,
		SongFilterComponent,
		UserAreaComponent
	]
})
export class AppModule { }
