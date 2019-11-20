import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../_services/user/user.service';
import { User } from '../_models';

@Component({
	selector: 'app-user-auth',
	templateUrl: './user-auth.component.html',
	styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit {

	formData: User = new User();

	constructor(
		private userService: UserService
	) {}

	appName(): string {
		return environment.appName;
	}

	version(): string{
		return environment.version.major + '.' + environment.version.minor + '.' + environment.version.revision;
	}

	ngOnInit() {
	}

	signIn(by:string = null){
		//if( !this.formData.provider && (!this.formData.email || !this.formData.password) ) return;
		this.userService.signIn( new User(
			null, this.formData.email, this.formData.password, null, null, null ,null, by
		));
	}
}
