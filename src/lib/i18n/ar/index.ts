import type { BaseTranslation } from '../i18n-types';
const ar = {
	profile: {
		logout: 'تسجيل الخروج',
		title: 'الملف الشخصي',
		reservation_history: 'الحجوزات',
		reservation_notification: 'الإشعارات'
	},
	HI: 'مرحبًا {name:string}! من فضلك اترك نجمة إذا أعجبك هذا المشروع: https://github.com/ivanhofer/typesafe-i18n',
	validation: {
		required: '{field} مطلوب'
	},
	buttons: {
		submit: 'إرسال',
		upload_sheet: 'حمل الملف',
		update: 'تحديث',
		loginForm: ' تسجيل الدخول'
	},
	home: 'الصفحة الرئيسية',
	form: 'نموذج',
	about: 'معلومات عنا',
	contact: 'اتصل بنا',
	location: 'الموقع',
	email: 'البريد الإلكتروني',
	phone: 'رقم الهاتف',
	news: 'أخبار',
	no_news: 'لا توجد أخبار',
	pdf_file: 'ملف PDF',
	services: 'الخدمات',
	exhibition: 'المعرض',
	exhibition_mini_data: {
		Reservation: {
			title: 'الحجز',
			place: 'العراق - السليمانية'
		},
		Companies: 'الشركات',
		Location: 'الموقع',
		Countries: 'الدول',
		Brochure: 'كتب المعرض',
		Fair: 'معرض السليمانية الدولي',
		Map_Title: 'خريطة المعرض',
		Exhibition_Sponsors: 'رعاة المعرض',
		Exhibition_Seats: 'مقاعد المعرض',
		Exhibition_PDF: 'ملفات PDF للمعرض'
	},
	exhibition_data:{
		"active" :"نشط"
		},
	promo: 'العروض',
	filterByExhibition: 'تصفية حسب المعرض',
	filterByDate: 'تصفية حسب التاريخ',
	clearFilters: 'مسح التصفية',
	sort: 'ترتيب',
	ascending: 'من القديم - الجديد',
	descending: 'من الجديد - القديم',
	seeAll: 'عرض الكل',
	marketing: 'التسويق',
	relations: 'العلاقات',
	technical: 'التقنية',
	administration: 'الإدارة',
	feedback: 'التعليقات',
	send: 'إرسال',
	successMessage: 'بنجاح! تم إرسال الرسالة!',
	successTeam: 'فريق النجاح لدينا',
	unmatchedServices: 'خدمة لا مثيل لها',
	specific: 'محدد',
	experience: 'الخبرة',
	technology: 'التكنولوجيا',
	ethics: 'الأخلاق',
	quality: 'الجودة',
	continuity: 'الاستمرارية',
	our: 'لدينا',
	mission: 'المهمة',
	commitment: 'التزام',
	recentNews: 'أخبار حديثة',
	address: 'العنوان',
	media: 'وسائل الإعلام',
	publishing: 'النشر',
	magazine: 'المجلة',
	gallery: 'المعرض',
	videos: 'الفيديوهات',
	MoreInGallery: 'المزيد في المعرض',
	moreVideos: 'المزيد من الفيديوهات',
	total_company_reserve: 'إجمالي حجوزات الشركات',
	reservation: {
		cancelReservation: 'إلغاء الحجز',
		RejectedByUser: 'تم رفضه من قبل المستخدم',
		quantity: 'الكمية :',
		pricePerService: 'السعر لكل خدمة :',
		totalPriceForThisService: 'السعر الإجمالي لهذه الخدمة :',
		lessThan: 'أقل من',
		isFree: 'مجاني',
		free: ' مجاني',
		pending: {
			description: 'لقد قمت بالفعل بحجز هذا المقعد بحالة',
			status: 'قيد الانتظار',
			click: 'انقر',
			here: 'هنا',
			to_cancel: 'لإلغاء حجزك',
			confirmation: 'هل أنت متأكد أنك تريد إلغاء حجزك؟',
			success: 'تم إلغاء حجزك بنجاح',
			yes: 'نعم، أنا متأكد',
			no: 'لا'
		},
		emptySeatMessage: 'للأسف، لا توجد حجوزات متاحة للفترة الزمنية الحالية لهذا المعرض.',
		gotoExhibition: 'اذهب إلى صفحة المعرض',
		short_message: 'السماح فقط بتحميل ملف Excel',
		afterUpload_message: 'لقد قرأت سياسة الخصوصية والخصوصية',
		warning_message: 'من فضلك قم بتحميل ملف Excel قبل الحجز.',
		reserved: 'تم استلام طلبك بنجاح، يرجى الانتظار للاتصال بکم',
		reserveUpdated: 'لقد قرأت وقبلت جميع الشروط والأحكام.',
		title: 'مقاعد المعرض',
		contract: 'عرض ملف العقد بصيغة PDF',
		welcome: 'مرحبًا',
		logged_in_description:
			'لحجز مقعد والحصول على معلومات حول كل مقعد، انقر فوق الانتقال إلى صفحة الحجز',
		not_logged_in_description:
			'لحجز مقعد والحصول على معلومات حول كل مقعد، يجب عليك تسجيل الدخول أولاً',
		logged_in_button: 'الانتقال إلى صفحة الحجز',
		not_logged_in_button: 'الانتقال إلى صفحة تسجيل الدخول',
		description: 'الوصف',
		comment: 'التعليق',
		comment_placeholder: 'من فضلك اكتب تعليق',
		manual_area: 'يمكنك إضافة المساحة يدوياً هنا',
		manual_area_description: 'يجب أن تكون المنطقة من مضاعفات تسعة مثل (٤٥م ، ٥٤م ، ٦٣م إلخ)		',
		new_description:
			'عزيزي المشارك  ، هذه الأسعار هي فقط سعر مساحة الأرض بدون أي خدمات مثل (تقسيم، سجادة، طاولة، كرسي، الخ...)',
		add_file: 'إضافة',
		cancel_file: 'إلغاء',
		required_file: 'مطلوب',
		upload_file: 'تحميل ملف Excel',
		services: {
			title: 'الخدمات',
			free_services: 'الخدمات المجانية',
			paid_services: 'الخدمات المدفوعة'
		},
		total_price: 'السعر الإجمالي',
		price_per_each_meter: 'السعر لكل متر',
		reserve: 'حجز',
		preview_contract: 'معاينة العقد',
		seat_types: {
			selected: 'محدد',
			reserved: 'محجوز',
			pending: 'معلق'
		},
		available_area: 'المساحة المتاحة',
		areaPrice: ' سعر المنطقة ',
		addService: ' إضافة خدمة',
		servicesPrice: ' سعر الخدمات ',
		totalPrice: ' السعر الكلي ',
		modalTitle: 'قائمة الخدمات المتاحة لهذه المنطقة',
		modalInfo: '  يرجى اختيار مربع الاختيار وإدخال عدد الكميات لإدراج الخدمات التي ترغب بها',
		priceSeat: ': السعر ',
		discountSeat: ' : الخصم ',
		notAvailable: 'غير متوفر',
		messageToValidation: 'الحد الأقصى المسموح به لهذه الخدمة هو {maxQuantity}.',
		messageToValidationBeforeReserve: '`يرجى التأكد من إدخال كمية صحيحة للخدمات.`',
		measure: {
			m: 'متر'
		},
		unselect_seat_desc: 'حدد مقعدًا للحصول على معلومات حوله',
		privacy_policy: {
			title: 'شروط الحجز',
			accept: 'أوافق',
			decline: 'رفض',
			checked: 'لقد قرأت ووافقت على الشروط والأحكام'
		},
		login: {
			title: 'تسجيل الدخول',
			email: 'البريد الإلكتروني',
			password: 'كلمة المرور'
		},
		statuses: {
			pending: 'معلق',
			accept: 'مقبول',
			reject: 'مرفوض'
		}
	},

	register: {
		registerForm: 'نموذج التسجيل',
		alertText: 'هل لديك حساب؟',
		warning: 'الرقم السري يجب الا يقل عن 6 احرف على الاقل.'
	},

	loggin: {
		message: 'من فضلك تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور',
		login: 'تسجيل الدخول',
		register: 'تسجيل',
		forgot_password: 'نسيت كلمة المرور؟',
		reset_password: 'إعادة تعيين كلمة المرور',
		change_password: 'تغيير كلمة المرور',
		send_email: 'إرسال البريد الإلكتروني',
		Modal: {
			successMsg: 'تم إنشاء حسابك بنجاح',
			msg: 'قم بالتحقق من عنوان بريدك الإلكتروني لتفعيل حسابك'
		},
		duplicate_password: 'يجب أن تكون كلمة المرور الجديدة متطابقة مع كلمة المرور القديمة',
		error: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
		loginDesc: 'مرحبًا بعودتك! الرجاء إدخال التفاصيل الخاصة بك',
		email: 'البريد الإلكتروني',
		password: 'كلمة المرور',
		signIn: 'تسجيل الدخول',
		alertText: 'ليس لديك حساب؟'
	},
	company_info: {
		user_message: 'صورة المستخدم مطلوبة',
		passport_message: 'صورة جواز السفر مطلوبة',
		specific_country_message: 'دولة محددة مطلوبة',
		specific_country: 'دولة أخرى',
		logo_url: 'تحميل شعار الشركة',
		phone_number: 'رقم الهاتف',
		company_name: 'اسم الشركة',
		email: 'عنوان البريد الإلكتروني',
		working_field: 'مجال العمل',
		manager_name: 'اسم المدير',
		passport_number: 'رقم جواز السفر',
		address: 'العنوان',
		country: 'دولة',
		passport_image: 'تحميل جواز السفر',
		user_image: 'تحميل صورة المستخدم',
		string: ''
	},

	email_template: {
		dear: 'عزيزي/عزيزتي',
		thanks:
			'شكرًا لاختيارك حجز مقعد عبر موقعنا. نحن مسرورون لأنك اعتبرت معرض السلیمانیة الدولی لخططك القادمة. هذا البريد الإلكتروني لتأكيد استلام طلب الحجز بنجاح.',
		detail: {
			title: 'إليك تفاصيل حجزك:',
			date_time: 'تاريخ ووقت الحجز:',
			event: 'المعرض: ',
			note: 'طلبات خاصة أو ملاحظات:'
		},
		pending:
			'يرجى ملاحظة أن طلب الحجز الخاص بك المعلق حاليًا للتأكيد. سيقوم فريقنا بمراجعة طلبك بعناية، وسنقوم بأعلامکم في أقرب وقت ممكن بشأن حالة طلب الحجز الخاص بك.',
		help: {
			header:
				'في الوقت الحالي، إذا كان لديك أي أسئلة أو إجراء تغييرات على حجزك، فلا تتردد في الاتصال بنا على',
			footer: 'فريقنا المخصص هنا لمساعدتك وضمان تجربتك معنا استثنائية'
		},
		thanks_waiting:
			'شكرًا لك على اختيار معرض السلیمانیة الدولی. نتطلع إلى إمكانية استضافتك وتقديم تجربة لا تُنسى. رضاؤك هو أعلى أولوياتنا، وسنقوم ببذل قصارى جهدنا لاستيعاب طلبك',
		regards: 'مع خالص التحية،',
		signature: 'معرض السلیمانیة الدولی',
		contact: {
			marketing: 'التسويق: ',
			relations: 'العلاقات: ',
			technical: 'التقنية: ',
			administration: 'الإدارة: ',
			website: 'الموقع الإلكتروني: ',
			warningMessage:
				'هذه رسالة بريد إلكتروني آلية ولا تتم مراقبتها للرد عليها. من فضلك لا تعيد تشغيل هذا البريد الإلكتروني',
			regard: 'يعتبر',
			team: 'SulyExpo فريق'
		}
	},
	registrationForm: {
		userInfo: 'معلومات المستخدم ل',
		title: 'مرحبا بكم في ',
		subtitle: 'يرجى ملء نموذج التسجيل',
		userName: 'الاسم الكامل',
		email: 'البريد الإلكتروني',
		country: 'البلد',
		city: 'المدينة',
		companyName: 'اسم الشركة',
		fieldWork: 'مجال العمل',
		jobGrade: 'الدرجة الوظيفية',
		phoneNumber: 'رقم الهاتف',
		referrer_name: 'من أحالك إلى معرضنا؟',
		hotelBooking: 'هل تحتاج إلى حجز فندق؟',
		invalidEmail: 'تنسيق البريد الإلكتروني غير صالح.',
		existEmail: 'البريد الإلكتروني موجود بالفعل في قاعدة البيانات.',
		insertData: 'تم إدخال البيانات وإرسال البريد الإلكتروني بنجاح',
		emailFailureMessage: 'تم إدخال البيانات لكن فشل إرسال البريد الإلكتروني',
		failureMessage: 'حدث خطأ. قد لا يتم إدخال البيانات أو إرسال البريد الإلكتروني.',
		createdAt: 'تاريخ الإنشاء'
	},
	You_have_to_select_at_least_one_area: 'بالإضافة إلى ذلك، يجب عليك تحديد بند واحد على الأقل',
	Please_upload_excel_file: 'يرجى تحميل ملف إكسل'
} satisfies BaseTranslation;
export default ar;
