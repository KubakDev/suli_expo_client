import type { Translation } from '../i18n-types';

const ar = {
	// arabic language translation
	HI: 'مرحبا {name}! يرجى تقديم نجمة ، وقت الاستجابة للمشاريع في الطوابق السفلية',
	home: 'الرئيسية',
	about: 'حول',
	contact: 'اتصل',
	news: 'أخبار',
	no_news: 'لا توجد أخبار حتى الآن',
	pdf_file: 'ملف PDF',
	services: 'خدمات',
	exhibition: 'معرض',
	exhibition_mini_data: {
		Reservation: {
			title: "حجز",
			place: "العراق - السليمانية",
		},
		Companies: "الشركات",
		Countries: "بلدان",
		Brochure: "كراسة المعرض",
		Fair: "معرض السليمانية الدولي",
		Map_Title: "خريطة المعرض",
		Exhibition_Sponsors: "رعاة المعرض",
		Exhibition_Seats: "مقاعد المعرض",
		Exhibition_PDF: "فایل المعرض (PDF)"
	},
	promo: 'ترويجي',
	filter: 'منقي',
	seeAll: 'اظهار الكل',
	marketing: 'التسويق',
	relations: 'الاتصال',
	technical: 'تقني',
	administration: 'الإدارة',
	feedback: 'تعليق',
	send: 'يرسل',
	successMessage: 'نجاح! الرسالة المرسلة!',
	successTeam: 'فريق النجاح لدينا',
	unmatchedServices: 'خدمة لا مثيل لها',
	specific: 'محدد',
	experience: 'خبرة',
	technology: 'تكنولوجيا',
	ethics: 'أخلاق مهنية',
	quality: 'جودة',
	continuity: 'استمرارية',
	our: 'ملكنا',
	mission: 'مهمة',
	commitment: 'التزام',
	resentNews: 'أخبار حديثة',
	address: 'عنوان',
	media: 'وسائل الإعلام',
	publishing: 'نشر',
	magazine: 'مجلة',
	gallery: 'صالة عرض',
	videos: 'مقاطع الفيديو',
	MoreInGallery: 'المزيد في المعرض',
	moreVideos: 'المزيد من مقاطع الفيديو',
	reservation: {
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
		}
	}
} satisfies Translation;

export default ar;
