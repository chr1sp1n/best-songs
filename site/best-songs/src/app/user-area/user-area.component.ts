import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../_services/user/user.service';
import { User } from '../_models';

@Component({
	selector: 'app-user-area',
	templateUrl: './user-area.component.html',
	styleUrls: ['./user-area.component.scss']
})
export class UserAreaComponent implements OnInit {

	user: User = new User();

	constructor(
		public activeModal: NgbActiveModal,
		private userSevice: UserService
	) { }

	ngOnInit() {
		this.user = this.userSevice.getUser();
		console.log(this.user);
	}

	signOut(){
		this.userSevice.signOut();
		this.activeModal.close();
	}

	save(){
		console.log(this.user);
	}
}
