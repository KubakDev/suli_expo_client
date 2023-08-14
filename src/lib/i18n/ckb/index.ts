import type { Translation } from '../i18n-types';

const ckb = {
	// this is an example Translation, just rename or delete this folder if you want
	HI: 'سڵاو {name}! تکایە ستارەیەک بەرز بدە، کاتێک پرۆژەکە لە دڵخوازەکاند',
	validation: {
		required: '{field} is required',
	},
	buttons: {
		submit: 'ناردن',
	},
	home: 'سەرەکی',
	about: 'دەربارە',
	contact: 'پەیوەندی',
	news: 'هەواڵەکان',
	no_news: 'هیچ هەواڵێک نییە لە ئێستا',
	pdf_file: 'پەڕگەی PDF',
	services: 'خزمەتگوزاری',
	exhibition: 'پێشانگاکان',
	exhibition_mini_data: {
		Reservation: {
			title: 'حیجزکردن',
			place: 'عێراق - سلێمانی'
		},
		Companies: 'کۆمپانیاکان',
		Countries: 'وڵاتەکان',
		Brochure: 'بڕۆشوری پێشانگا',
		Fair: 'پێشانگای نێودەوڵەتی سلێمانی',
		Map_Title: 'نەخشەی پێشانگا',
		Exhibition_Sponsors: 'سپۆنسەرەکانی پێشانگا',
		Exhibition_Seats: 'کورسی پێشانگە',
		Exhibition_PDF: 'فایلی پێشانگا (PDF)'
	},
	promo: 'پرۆمۆ',
	filter: 'فیلتەر',
	seeAll: 'هەموو ببینە',
	marketing: 'بازاڕکردن',
	relations: 'پەیوەندییەکان',
	technical: 'تەکنیکی',
	administration: 'ئیدارە',
	feedback: 'پێشنیار',
	send: 'ناردن',
	successMessage: 'سەرکەوتوبوو! پەیامی نێردراوە!',
	successTeam: 'تیمی سەرکەوتنمان',
	unmatchedServices: 'خزمەتگوزاری بێ هاوتا',
	specific: 'تایبەت',
	experience: 'ئەزموون',
	technology: 'تەکنەلۆجیا',
	ethics: 'ئێتیک',
	quality: 'کواڵیتی',
	continuity: 'بەردەوامی',
	our: 'ئێمە',
	mission: 'ئەرکی',
	commitment: 'پابەند بوونی',
	resentNews: 'هەواڵەکانی نوێ',
	address: 'ناونیشان',
	media: 'میدیا',
	publishing: 'چاپکردن',
	magazine: 'ماڵپەڕ',
	gallery: 'گەلەری',
	videos: 'ڤیدیۆکان',
	MoreInGallery: 'زیاتر لە گەلەری',
	moreVideos: 'زیاتر لە ڤیدیۆکان',
	reservation: {
		title: "خشتەی پێشانگا",
		welcome: 'بەخێربێیت',
		logged_in_description: 'بۆ گرتنی شوێن و وەرگرتنی زانیاری لەسەر هەر بەشێک ، وردەکاری شوێنگرتن بکەرەوە',
		not_logged_in_description: 'بۆ گرتنی شوێن و وەرگرتنی زانیاری لەسەر هەر بەشێک ،  تکایە تۆماربوون بکەرەوە',
		logged_in_button: "وردەکاری شوێنگرتن",
		not_logged_in_button: "تۆماربوون",
		description: "وردەکاری",
		comment: "سەرنج",
		comment_placeholder: "تکایە سەرنجەکەت بنووسە",
		services: {
			title: "خزمەتگوزاریەکان",
			free_services: "خزمەتگوزارییە بێ بەرامبەرەکان",
			paid_services: "خزمەتگوزاریەکان",
		},
		total_price: "کۆی گشتی",
		reserve: "بەکرێ گرتن",
		seat_types: {
			selected: 'دەستنیشانکراو',
			reserved: 'بەکرێ گیراو',
			pending: 'لە چاوەڕوانی',
		},
		unselect_seat_desc: "شوێنێک دەستنیشان بکە بۆ بەدەستهێنانی زانیاری لە سەری",
		privacy_policy: {
			title: 'مەرجەکانی بە کرێگرتن',
			accept: 'ڕازیم',
			decline: 'رازینیم',
		},
		login: {
			title: 'چوونەژوورەوە',
			email: 'ئیمەیڵ',
			password: 'وشەی نهێنی',
		}
	}
} satisfies Translation;

export default ckb;
