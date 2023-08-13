import type { BaseTranslation } from '../i18n-types';

const en = {
	// TODO: your translations go here
	HI: 'Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
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
	filter: 'Filter',
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
		description: "Description",
		comment: "Comment",
		comment_placeholder: "Please write your comment",
		services: {
			title: "Services",
			free_services: "Free Services",
			paid_services: "Services",
		},
		total_price: "Total Price",
		reserve: "Reserve",
		seat_types: {
			selected: 'SELECTED',
			reserved: 'RESERVED',
			pending: 'PENDING',
		},
		unselect_seat_desc: "Select a seat to get information about it",
		privacy_policy: {
			title: 'Terms of Reservation',
			accept: 'I accept',
			decline: 'Decline',
		}
	}
} satisfies BaseTranslation;

export default en;
