class Constants {
	static page_max_width = ' xl:max-w-4xl 2xl:max-w-5xl 4xl:max-w-6xl px-4 xl:px-0';

	static section_padding_y = 'py-12';

	static section_margin_top = 'pt-12';

	static horizontal_padding = 'px-4 sm:px-0';

	static scrollbar_layout = "scrollbar-thumb-gray-600 scrollbar-track-gray-100 scrollbar-thin"

	static image_card_layout = "rounded-t-2xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-103 object-cover"

	static page_limit = 9;

	static main_theme = {
		primary:"var(--primaryColor)",
		overlayPrimary:"var(--overlayPrimaryColor)",
		secondary:"var(--secondaryColor)",
		overlaySecondary:"var(--overlaySecondaryColor)",
		background:"var(--backgroundColor)",
		overlayBackground:"var(--overlayBackgroundColor)",
	};

	static page_theme = {
		news:{
			primary:"var(--newsPrimaryColor)",
			overlayPrimary:"var(--newsOverlayPrimaryColor)",
			secondary:"var(--newsSecondaryColor)",
			overlaySecondary:"var(--newsOverlaySecondaryColor)",
			background:"var(--newsBackgroundColor)",
			overlayBackground:"var(--newsOverlayBackgroundColor)",
		},
		exhibition:{
			primary:"var(--exhibitionPrimaryColor)",
			overlayPrimary:"var(--exhibitionOverlayPrimaryColor)",
			secondary:"var(--exhibitionSecondaryColor)",
			overlaySecondary:"var(--exhibitionOverlaySecondaryColor)",
			background:"var(--exhibitionBackgroundColor)",
			overlayBackground:"var(--exhibitionOverlayBackgroundColor)",
		},
		gallery:{
				primary:"var(--galleryPrimaryColor)",
				overlayPrimary:"var(--galleryOverlayPrimaryColor)",
				secondary:"var(--gallerySecondaryColor)",
				overlaySecondary:"var(--galleryOverlaySecondaryColor)",
				background:"var(--galleryBackgroundColor)",
				overlayBackground:"var(--galleryOverlayBackgroundColor)",
		},
		magazine:{
			primary:"var(--magazinePrimaryColor)",
				overlayPrimary:"var(--magazineOverlayPrimaryColor)",
				secondary:"var(--magazineSecondaryColor)",
				overlaySecondary:"var(--magazineOverlaySecondaryColor)",
				background:"var(--magazineBackgroundColor)",
				overlayBackground:"var(--magazineOverlayBackgroundColor)",
		},
		video:{
			primary:"var(--videoPrimaryColor)",
				overlayPrimary:"var(--videoOverlayPrimaryColor)",
				secondary:"var(--videoSecondaryColor)",
				overlaySecondary:"var(--videoOverlaySecondaryColor)",
				background:"var(--videoBackgroundColor)",
				overlayBackground:"var(--videoOverlayBackgroundColor)",
		},
		publishing:{
			primary:"var(--publishingPrimaryColor)",
				overlayPrimary:"var(--publishingOverlayPrimaryColor)",
				secondary:"var(--publishingSecondaryColor)",
				overlaySecondary:"var(--publishingOverlaySecondaryColor)",
				background:"var(--publishingBackgroundColor)",
				overlayBackground:"var(--publishingOverlayBackgroundColor)",
		}
	}

	
}

export default Constants;
