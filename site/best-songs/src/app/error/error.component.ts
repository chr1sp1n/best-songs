import { Component, OnInit, Input } from '@angular/core';
// import { BestSong } from '../best-song';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

	@Input() error: any;

	constructor( public activeModal: NgbActiveModal ) {}

	ngOnInit() {
		// console.log('Error component:', this.error );
	}

}
