import { Component } from '@angular/core';
import { UserService } from './_services';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})


export class AppComponent {

	authenticated: boolean = false;

	constructor(
		private userService: UserService
	){}

	ngOnInit(){
		this.userService.userChange.subscribe( (state: boolean) => {
			this.authenticated = state;
		});

		this.authenticated = this.userService.state();
	}

}
