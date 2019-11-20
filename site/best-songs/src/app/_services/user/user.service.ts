import { Injectable, Output, EventEmitter } from '@angular/core';
import { AuthService, SocialUser } from 'angular-6-social-login-v2';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider } from 'angular-6-social-login-v2';
import { User } from '../../_models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	maxCalls: number = 1;

	@Output() userChange: EventEmitter<boolean> = new EventEmitter();

	constructor(
		private http: HttpClient,
		private authService: AuthService
	) {}


	create(user: User){
		return this.http.post(environment.apiAuth + '/users/create', user )
			.pipe(
				catchError( this.handleError('read', new Response()) )
			);
	}

	read(user: User){
		const params = new HttpParams()
			.set( 'id_user', user.id_user.toString() );

		return this.http.get(environment.apiAuth + '/users/read', { params: params })
			.pipe(
				catchError( this.handleError('read', new Response()) )
			);
	}

	update(user: User){
		return this.http.patch(environment.apiAuth + '/users/update', user )
			.pipe(
				catchError( this.handleError('read', new Response()) )
			);
	}

	delete(user: User){
		const params = new HttpParams()
			.set( 'id_user', user.id_user.toString() );

		return this.http.get(environment.apiAuth + '/users/delete', { params: params })
			.pipe(
				catchError( this.handleError('read', new Response()) )
			);
	}




	// sign functions

	signIn( reqUser: User ){

		if( !reqUser.idToken && reqUser.provider && this.maxCalls > 0){
			this.socialSignIn(reqUser.provider);
			//--this.maxCalls;
			return;
		}

		if( reqUser.email ){
			this.http.post<any>(environment.apiAuth + '/users/authenticate', { reqUser })
				.subscribe( (response) => {
					if(response && response.errors.length == 0 && response.data){
						response.data.provider = reqUser.provider;
						localStorage.setItem('currentUser', JSON.stringify(response.data));
						this.userChange.emit(true);
					}else{
						console.error('Sign-In error: ', response.errors);
					}
				});
		}

	}

	signOut (){
		try {
			let user = JSON.parse(localStorage.getItem('currentUser'));
			if(user.provider){
				this.authService.getStatus(user.provider).then(
					(u) => { this.authService.signOut(); }
				);
			}
		} catch (error) {}
		localStorage.setItem('currentUser', null);
		this.userChange.emit(false);
	}

	getUser(){
		try {
			let user = JSON.parse(localStorage.getItem('currentUser'));
			return user;
		} catch (error) {}
		return null;
	}

	state(){
		return (this.getUser() != 'null') ? true: false;
	}

	private socialSignIn( socialPlatform : string ) {
		let socialPlatformProvider;

		if( socialPlatform == "facebook" ){
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
		} else if( socialPlatform == "google" ){
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
		} else if ( socialPlatform == "linkedin" ) {
			socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
		}

		this.authService.signIn(socialPlatformProvider).then(
			(userData: SocialUser) => {
				this.signIn(
					new User(
						userData.id,
						userData.email,
						null,
						userData.idToken,
						userData.token,
						userData.name,
						userData.image,
						socialPlatform
					)
				);
			}
		);
	}

	// sign functions - END

	private handleError<T> (operation = 'operation', result?: T) {
		return (response: any): Observable<T> => {
			result = response.error;
			return of(result as T);
		};
	}
}
