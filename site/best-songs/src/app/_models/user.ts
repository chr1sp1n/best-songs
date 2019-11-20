import { SocialUser } from "angular-6-social-login-v2";

export class User extends SocialUser{
	id_user: number;
	password: string;
	last_sign_in: string;
	creation_date_time: string;
	last_edit: string;
	state: number;
	picture: string;
	userName: string;

	constructor(
		id: string = null,
		email: string = null,
		password: string = null,
		idToken: string = null,
		token: string = null,
		name: string = null,
		image: string = null,
		provider: string = null,
		id_user: number = 0,
		state: number = 0
	){
		super();
		this.id = id;
		this.email = email;
		this.password = password;
		this.idToken = idToken;
		this.token = token;
		this.name = name;
		this.image = image;
		this.provider = provider;
		this.id_user = id_user;
		this.state = state;
	}

}