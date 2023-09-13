import type { BaseTranslation } from '../i18n-types';

const en = {
	HI: 'Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
	validation: {
		required: '{field} is required'
	},
	buttons: {
		submit: 'Submit',
		upload_sheet: "Upload Sheet"
	},
	home: 'Home',
	about: 'About',
	contact: 'Contact',
	news: 'News',
	no_news: 'No News Yet',
	pdf_file: 'PDF File',
	services: 'Services',
	exhibition: 'Exhibition',
	exhibition_mini_data: {
		Reservation: {
			title: 'Reservation',
			place: 'Iraq - Sulaymaniyah'
		},
		Companies: 'Companies',
		Countries: 'Countries',
		Brochure: 'Exhibition Brochure',
		Fair: 'Sulaymaniyah International Fair',
		Map_Title: 'Exhibition Map',
		Exhibition_Sponsors: 'Exhibition Sponsors',
		Exhibition_Seats: 'Exhibition Seats',
		Exhibition_PDF: "Exhibition PDF'S"
	},
	promo: 'Promo',
	filterByExhibition: 'Filter By Exhibition',
	filterByDate: 'Filter By Date',
	ascending: 'Old - New',
	descending: 'New - Old',
	seeAll: 'See all',
	marketing: 'Marketing',
	relations: 'Relations',
	technical: 'Technical',
	administration: 'Administration',
	feedback: 'Feedback',
	send: 'Send',
	successMessage: 'Success! Sent Message!',
	successTeam: 'Our Success Team',
	unmatchedServices: 'Unmatched Service',
	specific: 'Specific',
	experience: 'Experience',
	technology: 'Technology',
	ethics: 'Ethics',
	quality: 'Quality',
	continuity: 'Continuity',
	our: 'Our',
	mission: 'Mission',
	commitment: 'Commitment',
	resentNews: 'Recent News',
	address: 'Address',
	media: 'Media',
	publishing: 'Publishing',
	magazine: 'Magazine',
	gallery: 'Gallery',
	videos: 'Videos',
	MoreInGallery: 'More in Gallery',
	moreVideos: 'More Videos',
	reservation: {
		reserved: "Your request has been successfully received, please wait for our contact",
		title: 'Exhibition Seats',
		contract: 'View PDF Contract',
		welcome: 'Welcome',
		logged_in_description:
			'To reserve a seat and get information about each one , click goto reservation page',
		not_logged_in_description:
			'To reserve a seat and get information about each one ,you have to logging before',
		logged_in_button: 'goto reservation page',
		not_logged_in_button: 'goto login page',
		description: 'Description',
		comment: 'Comment',
		comment_placeholder: 'Please write your comment',
		services: {
			title: 'Services',
			free_services: 'Free Services',
			paid_services: 'Services'
		},
		total_price: 'Total Price',
		reserve: 'Reserve',
		seat_types: {
			selected: 'SELECTED',
			reserved: 'RESERVED',
			pending: 'PENDING'
		},
		available_area: 'Available Area',
		measure: {
			m: 'Meter'
		},
		unselect_seat_desc: 'Select a seat to get information about it',
		privacy_policy: {
			title: 'Terms of Reservation',
			accept: 'I accept',
			decline: 'Decline',
			checked: "I have read  to the terms and conditions"
		},
		login: {
			title: 'Login',
			email: 'Email',
			password: 'Password'
		}
	},
	loggin: {
		login: 'Login',
		register: 'Register',
		forgot_password: 'Forgot password?',
		reset_password: 'Reset password',
		send_email: 'Send email',

		Modal: {
			successMsg: 'Your account has been created successfully',
			msg: 'Verify your email address to activate your account'
		},
		error: 'invalid email or password'
	},
	company_info: {
		type: 'Company type',
		logo_url: 'Upload logo',
		phone_number: 'Phone number',
		company_name: 'Company name',
		email: 'Email address',
		working_field: 'Working field',
		manager_name: 'Manager name',
		passport_number: 'Passport number',
		address: 'Address'
	}
} satisfies BaseTranslation;

export default en;
