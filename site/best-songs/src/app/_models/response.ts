export class Response{
	data: any;
	errors: any[];
	meta: any;

	constructor(obj?){
		if(obj){
			this.data = obj.data;
			this.errors = [];
			obj.errors.forEach( error => {
				this.errors.push(error);
			});
			this.meta = obj.meta;
		}else{
			this.data = null;
			this.errors = [ {
				status: null,
				code: null,
				title: null,
				detail: null,
			}];
			this.meta = {
				copyright: null,
				authors: []
			};
		}
	}

	hasErrors(){
		return this.errors.length > 0;
	}
}