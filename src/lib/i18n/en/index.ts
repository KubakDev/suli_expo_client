import type { BaseTranslation } from '../i18n-types';

const en = {
	profile: {
		logout: 'Logout',
		title: 'Profile',
		reservation_history: 'Reservations',
		reservation_notification: 'Notification'
	},
	HI: 'Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
	validation: {
		required: '{field} is required'
	},
	buttons: {
		submit: 'Submit',
		upload_sheet: 'Upload Sheet',
		update: 'Update',
		loginForm: 'Login Form'
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
		Location: 'Location',
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
		pending: {
			description: 'you already reserved this seat with status',
			status: 'Pending',
			click: 'click',
			here: 'here',
			to_cancel: 'to cancel your reservation',
			confirmation: 'Are you sure you want to cancel your reservation?',
			success: 'Your reservation has been canceled successfully',
			yes: "yes , I'm sure",
			no: 'No'
		},
		total_company_reserve: 'Total Company Reserve',
		emptySeatMessage:
			'	Regrettably, there are no available reservations for the current time slot at this exhibition.',
		gotoExhibition: 'Go to Exhibition Page',
		short_message: 'Just allow to upload Excel file',
		afterUpload_message: "I've read the privacy and privacy policy",
		warning_message: 'Please upload an Excel File before reserving a seat.',
		reserved: 'Your request has been successfully received, please wait for our contact',
		reserveUpdated: 'Your request has been successfully updated, please wait for our contact',
		title: 'Booth Reservation',
		contract: 'View PDF Contract',
		welcome: 'Welcome',
		logged_in_description:
			'To reserve a seat and get information about each one , click goto reservation page',
		not_logged_in_description: 'To book your booth and get more information, Please login before ',
		logged_in_button: 'goto reservation page',
		not_logged_in_button: 'goto login page',
		description: 'Description',
		comment: 'Comment',
		comment_placeholder: 'Please write your comment',
		manual_area: 'you can add area manually here',
		manual_area_description:
			'More than 36 meter (the area has to be a multiple of nine such as 45 , 54 m , 63m etc..	)',
		new_description: 'Dear Participant These prices are only the price of the land area without any services such as (partition, carpet, table, chair, etc. ...)',
		add_file: 'Add',
		cancel_file: 'cancel',
		required_file: 'Required',
		upload_file: 'Upload Excel File',
		services: {
			title: 'Services',
			free_services: 'Free Services',
			paid_services: 'Services'
		},
		total_price: 'Total Price',
		price_per_each_meter: 'Price per meter',
		reserve: 'Reserve',
		preview_contract: 'Contract Preview',
		seat_types: {
			selected: 'SELECTED',
			reserved: 'RESERVED',
			pending: 'PENDING'
		},
		available_area: 'Available area',
		measure: {
			m: 'Meter'
		},
		unselect_seat_desc: 'Select a seat to get information about it',
		privacy_policy: {
			title: 'Terms of Reservation',
			accept: 'I accept',
			decline: 'Decline',
			checked: 'I have read  to the terms and conditions'
		},
		login: {
			title: 'Login',
			email: 'Email',
			password: 'Password'
		},
		statuses: {
			pending: 'Pending',
			accept: 'Accepted',
			reject: 'Rejected'
		}
	},
	register: {
		registerForm: 'Register Form',
		alertText: 'Do you have account?',
		warning: 'Password must be at least 6 characters long.'
	},

	loggin: {
		message: 'Please Check Your Email for reset password',
		login: 'Login',
		register: 'Register',
		forgot_password: 'Forgot password?',
		reset_password: 'Reset password',
		change_password: 'Change password',
		send_email: 'Send email',

		Modal: {
			successMsg: 'Your account has been created successfully',
			msg: 'Verify your email address to activate your account'
		},
		duplicate_password: 'New password must be identical to old one',
		error: 'invalid email or password',
		loginDesc: 'Welcome back! Please enter your details',
		email: 'Email',
		password: 'Password',
		signIn: 'Sign In',
		alertText: "Don't have account?"
	},
	company_info: {
		user_message: 'User Image is required',
		passport_message: 'Passport Image is required',
		specific_country_message: 'Specific country is required',
		specific_country: 'Specific country',
		logo_url: 'Upload logo',
		phone_number: 'Phone number',
		company_name: 'Company name',
		email: 'Email address',
		working_field: 'Working field',
		manager_name: 'Manager name',
		passport_number: 'Passport number',
		address: 'Address',
		country: 'Country',
		passport_image: 'Upload Passport Image',
		user_image: 'Upload User Image',
		string: ''
	},
	email_template: {
		dear: 'Dear',
		thanks:
			'Thank you for choosing to reserve a seat through our website. We are delighted that you have considered Suly Expo for your upcoming plans. This email is to confirm that we have successfully received your reservation request.',
		detail: {
			title: 'Here are the details of your reservation:',
			date_time: 'Reservation Date and Time:',
			event: 'Exhibition: ',
			note: 'Special Requests or Notes:'
		},
		pending:
			'Please note that your reservation is currently pending confirmation. Our team will carefully review your request, and we will notify you as soon as possible regarding the status of your reservation.',
		help: {
			header:
				'In the meantime, if you have any questions or need to make changes to your reservation, please do not hesitate to contact us at',
			footer:
				'Our dedicated team is here to assist you and ensure your experience with us is exceptional'
		},
		thanks_waiting:
			'Thank you for choosing Suly Expo. We look forward to the possibility of hosting you and providing you with an unforgettable experience. Your satisfaction is our top priority, and we will do our utmost to accommodate your request',
		regards: 'Warm regards,',
		signature: 'Suly Expo',
		contact: {
			marketing: 'Marketing: ',
			relations: 'Relations: ',
			technical: 'Technical: ',
			administration: 'Administration: ',
			website: 'Website: ',
			warningMessage:
				'This is an automated email and is not monitored for response. Please do not replay to this email.',
			regard: 'Regards',
			team: 'SulyExpo Team'
		}
	}
} satisfies BaseTranslation;

export default en;
