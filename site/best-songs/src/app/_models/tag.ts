export class Tag{
	label: string = null;
	state: boolean = false;

	constructor( label:string = null, state: boolean = false ){
		this.label = label;
		this.state = state;
	}
}