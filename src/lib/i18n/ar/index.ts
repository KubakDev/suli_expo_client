import type { Translation } from '../i18n-types';

const ar = {
	// arabic language translation
	HI: 'مرحبا {name}! يرجى تقديم نجمة ، وقت الاستجابة للمشاريع في الطوابق السفلية',
	validation: {
		required: '{field} مطلوب'
	},
	buttons: {
		submit: 'إرسال'
	},
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
			title: 'حجز',
			place: 'العراق - السليمانية'
		},
		Companies: 'الشركات',
		Countries: 'بلدان',
		Brochure: 'كراسة المعرض',
		Fair: 'معرض السليمانية الدولي',
		Map_Title: 'خريطة المعرض',
		Exhibition_Sponsors: 'رعاة المعرض',
		Exhibition_Seats: 'مقاعد المعرض',
		Exhibition_PDF: 'فایل المعرض (PDF)'
	},
	promo: 'ترويجي',
	filterByExhibition: 'تصفية حسب المعرض',
	filterByDate: 'تصفية حسب التاريخ',
	ascending: 'قديم - جديد',
	descending: 'جديد - قديم',
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
		title: 'مقاعد المعرض',
		contract: 'عرض العقد',
		welcome: 'مرحبا بكم',
		logged_in_description: 'لحجز مقعد والحصول على معلومات حول كل مقعد ، يجب تسجيل الدخول أولاً',
		not_logged_in_description: 'لحجز مقعد والحصول على معلومات حول كل مقعد ، يجب تسجيل الدخول أولاً',
		logged_in_button: 'تسجيل الدخول',
		not_logged_in_button: 'تسجيل الدخول',
		description: 'لحجز مقعد والحصول على معلومات حول كل مقعد ، يجب تسجيل الدخول أولاً',
		comment: 'تعليق',
		comment_placeholder: 'يرجى كتابة تعليقك',
		services: {
			title: 'الخدمات',
			free_services: 'خدمات مجانية',
			paid_services: 'خدمات'
		},
		total_price: 'السعر الكلي',
		reserve: 'حجز',
		seat_types: {
			selected: 'مختار',
			reserved: '	محجوز',
			pending: 'قيد الانتظار'
		},
		unselect_seat_desc: 'حدد مقعدًا للحصول على معلومات حوله',
		privacy_policy: {
			title: 'شروط الحجز',
			accept: 'أوافق',
			decline: 'رفض'
		},
		login: {
			title: 'تسجيل الدخول',
			email: 'البريد الإلكتروني',
			password: 'كلمه السر'
		}
	},
	loggin: {
		login: 'تسجيل الدخول',
		register: 'تسجيل',
		Modal: {
			successMsg: 'تم تسجيل الحساب بنجاح',
			msg: 'تم إرسال بريد إلكتروني إلى عنوان البريد الإلكتروني التالي '
		}
	},

	company_info: {
		type: ' نوع الشركة',
		logo_url: 'تحميل الشعار',
		phone_number: ' رقم الهاتف',
		company_name: ' اسم الشركة',
		email: 'عنوان البريد الإلكتروني',
		working_field: 'مجال العمل',
		manager_name: 'اسم المدير',
		passport_number: 'رقم جواز السفر',
		address: 'عنوان'
	}
} satisfies Translation;

export default ar;
