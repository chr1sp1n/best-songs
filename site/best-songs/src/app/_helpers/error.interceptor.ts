import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from '../error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
		private userService: UserService,
		private modalService: NgbModal
	) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
			catchError( err => {
				if (err.status === 401) this.userService.signOut();
				if( err.error ) this.openError(err.error);
            	const error = err.error.message || err.statusText;
            	return throwError(error);
			})
		)
	}

	private openError(data?: any){
		const modalRef = this.modalService.open(ErrorComponent, { size: 'lg', centered: true });
		modalRef.componentInstance.error = data;
	}
}