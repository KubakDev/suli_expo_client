import type { Translation } from '../i18n-types';

const ckb = {
	// this is an example Translation, just rename or delete this folder if you want
	profile: {
		title: "پرۆفایل",
		reservation_history: 'حجزکراوەکان'
	},
	HI: 'سڵاو {name}! تکایە ستارەیەک بەرز بدە، کاتێک پرۆژەکە لە دڵخوازەکاند',
	validation: {
		required: '{field} is required'
	},
	buttons: {
		submit: 'ناردن',
		upload_sheet: 'بارکردنی شیت',
		update: 'نوێکردنەوە'
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
	filterByExhibition: 'فیلتەر بەپێی پێشانگا',
	filterByDate: 'فیلتەر بەپێی بەروار',
	ascending: 'کۆن - نوێ',
	descending: 'نوێ - کۆن',
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
	total_company_reserve: 'کۆی گشتیی حیجزەکان',
	reservation: {
		reserved: "داواکاریەکەت بە سەرکەوتووی وەرگیرا ، تکایە چاوروان بە تاکوو پەیوەندیت پێوە دەکەین",
		title: 'خشتەی پێشانگا',
		contract: ' زانیاری گرێبەست',
		welcome: 'بەخێربێیت',
		logged_in_description:
			'بۆ گرتنی شوێن و وەرگرتنی زانیاری لەسەر هەر بەشێک ، وردەکاری شوێنگرتن بکەرەوە',
		not_logged_in_description:
			'بۆ گرتنی شوێن و وەرگرتنی زانیاری لەسەر هەر بەشێک ،  تکایە تۆماربوون بکەرەوە',
		logged_in_button: 'وردەکاری شوێنگرتن',
		not_logged_in_button: 'تۆماربوون',
		description: 'وردەکاری',
		comment: 'سەرنج',
		comment_placeholder: 'تکایە سەرنجەکەت بنووسە',
		manual_area: "لێرەدا دەتوانی ڕوبەر دیاری بکەیت",
		services: {
			title: 'خزمەتگوزاریەکان',
			free_services: 'خزمەتگوزارییە بێ بەرامبەرەکان',
			paid_services: 'خزمەتگوزاریەکان'
		},
		total_price: 'کۆی گشتی',
		price_per_each_meter: "نرخی هەر مەترێک",
		reserve: 'بەکرێ گرتن',
		preview_contract: 'پێشبینینی گرێبەست',
		seat_types: {
			selected: 'دەستنیشانکراو',
			reserved: 'بەکرێ گیراو',
			pending: 'لە چاوەڕوانی'
		},
		available_area: "روبەری پێویست",
		measure: {
			m: "مەتر",
		},
		unselect_seat_desc: 'شوێنێک دەستنیشان بکە بۆ بەدەستهێنانی زانیاری لە سەری',
		privacy_policy: {
			title: 'مەرجەکانی بە کرێگرتن',
			accept: 'مەرجەکان پەسەند دەکەم',
			decline: 'رازینیم',
			checked: "بە وردی مەرج و ڕێنماییەکانم خوێندوەتەوە"
		},
		login: {
			title: 'چوونەژوورەوە',
			email: 'ئیمەیڵ',
			password: 'وشەی نهێنی'
		},
		statuses: {
			pending: "لە چاوەڕوانی",
			accept: "پەسەندکراو",
			reject: "ڕەتکراو",

		}
	},
	loggin: {
		login: 'داخڵ بوون',
		register: 'تۆماربوون',
		forgot_password: 'وشەی نهێنیت لەبیرکردووە؟',
		reset_password: "تازەکردنەوەی وشەی نهێنی",
		change_password: 'گۆڕینی وشەی نهێنی',
		send_email: 'ناردنی ئیمەیڵ',
		Modal: {
			successMsg: 'بە سەرکەوتوویی هەژمارەکەت دروستکرا',
			msg: 'تکایە نامەی ئەلکترۆنیت پشتڕاست بکەرەوە بۆ کاراکردنی هەژمارەکەت'
		},
		error: 'ئیمەڵ یاخود وشەی نهێنیت هەڵەیە',
		duplicate_password: "وشەی نهێنی نوێ پێویستە جیاواز بێت لە کۆنەکە"
	},
	company_info: {
		type: 'جۆری كۆمپانیا',
		logo_url: 'لۆگۆ',
		phone_number: 'ژمارەی تەلەفۆن',
		company_name: 'ناوی کۆمپانیا',
		email: 'ناونیشانی ئیمەیڵ',
		working_field: 'بوارەکانی کارکردن',
		manager_name: 'ناوی بەڕێوەبەر',
		passport_number: 'ژمارەی پاسپۆرت',
		address: 'ناونیشان',
		string: ""
	},
	email_template: {
		dear: "سڵاو",
		thanks: "سوپاس بۆ هەڵبژاردنی شوێنێک لە ڕێگەی ماڵپەڕەکەمانەوە. ئێمە خۆشحاڵین کە ئێوە ڕەچاوی  پێشانگای نێودەوڵەتی سلێمانیتان کردووە بۆ پلانەکانی داهاتووتان. ئەم ئیمەیڵە بۆ پشتڕاستکردنەوەی ئەوەیە کە ئێمە بە سەرکەوتوویی داواکارییەکەتمان پێگەیشتووە.",
		detail: {
			title: "ئەمەی خوارەوە وردەکارییەکانی داواکارییەکەتە:",
			date_time: "کاتی ناردنی داواکاری",
			event: "پێشانگا",
			note: "وردەکاری",
		},
		pending: "تکایە تێبینی ئەوە بکە کە داواکارییەکەت لە ئێستادا چاوەڕێی پشتڕاستکردنەوەیە. تیمەکەمان بە وردی پێداچوونەوە بە داواکارییەکەت دەکات و ئێمە بە زووترین کات ئاگادارتان دەکەینەوە سەبارەت بە دۆخی داواکاریەکەت.",
		help: {
			header: "لە هەمان کاتدا، ئەگەر هەر پرسیارێکت هەیە یان پێویستت بە گۆڕانکاری هەیە لە داواکاریەکەت، تکایە دوودڵ مەبە لە پەیوەندیکردن بە ئێمەوە لە",
			footer: "تیمی تەرخانکراوی ئێمە لێرەیە بۆ یارمەتیدانت و دڵنیابوون لەوەی کە ئەزموونەکەت لەگەڵ ئێمە بێوێنەیە"
		},
		thanks_waiting: "سوپاس بۆ هه ڵبژاردنی پێشانگای نێودەوڵەتی سلێمانی  ئێمە چاوەڕوانی ئەوە دەکەین کە بتوانین میوانداریتان بکەین و ئەزموونێکی لەبیرنەکراوتان پێشکەش بکەین. ڕەزامەندی ئێوە ئەولەویەتی سەرەکی ئێمەیە و ئێمە هەموو هەوڵێک دەدەین بۆ جێبەجێکردنی داواکاریەکەت",
		regards: "لەگەڵ ڕێزدا",
		signature: "پێشانگای نێودەوڵەتی سلێمانی",
		contact: {
			marketing: "مارکێتینگ : ",
			relations: "پەیوەندییەکان :",
			technical: "تەکنیکی :",
			administration: " بەرێوبەر :",
			website: "ماڵپەر :",
		}

	}
} satisfies Translation;

export default ckb;
