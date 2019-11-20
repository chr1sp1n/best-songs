import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
		private userService: UserService
	) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if( request.url.indexOf(environment.apiBestSongs) == 0 || request.url.indexOf(environment.apiAuth) == 0 ){
			let user = this.userService.getUser();
			if ( user && user.token ) {
				request = request.clone({
					setHeaders: {
						Authorization: 'Bearer ' + user.token
					}
				});
			}
		}

		return next.handle(request);

	}

}