const colors = require('tailwindcss/colors');


module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/kubak-svelte-component/**/*.{html,js,svelte}',
		"./node_modules/tw-elements/dist/js/**/*.js"
	],

	plugins: [
	require('flowbite/plugin'),
	require('tailwind-scrollbar')({ nocompatible: true }),
	require("tw-elements/dist/plugin.cjs")
],

	darkMode: 'class',

	theme: {
		extend: {
			screens: {
				'3xl': '1920px',
				'4xl': '2560px'
			},
			maxWidth: {
				10: '2.5rem',
				20: '5rem',
				32: '8rem',
				40: '10rem',
				48: '12rem',
				64: '16rem',
				80: '20rem',
				96: '24rem',
				128: '32rem',
				150: '37.5rem',
				175: '43.75rem'
			},
			minWidth: {
				10: '2.5rem',
				20: '5rem',
				32: '8rem',
				40: '10rem',
				48: '12rem',
				64: '16rem',
				80: '20rem',
				96: '24rem',
				128: '32rem',
				150: '37.5rem',
				175: '43.75rem'
			},
			maxHeight: {
				128: '32rem',
				150: '37.5rem',
				175: '43.75rem',
				200: '50rem',
				300: '75rem'
			},
			minHeight: {
				128: '32rem',
				150: '37.5rem',
				175: '43.75rem',
				200: '50rem',
				300: '75rem'
			},
			height: {
				'h-1/2': '1.25rem',
				100: '30rem',
				128: '32rem',
				200: '50rem'
			},
			width: {
				80: '20rem',
				100: '30rem',
				128: '32rem',
				142: '35.5rem',
				150: '37.5rem',
				200: '50rem',
				300: '75rem',
				350: '80rem'
			},
			colors: {
				// flowbite-svelte
				secondary: {
					DEFAULT: '#292E36'
				},
				primary: {
					50: '#E1B168',
					100: '#E1B168',
					200: '#E1B168',
					300: '#E1B168',
					400: '#E1B168',
					500: '#E1B168',
					600: '#E1B168',
					700: '#E1B168',
					800: '#E1B168',
					900: '#E1B168',
					DEFAULT: '#E1B168', //500
					on: '#E1B168', //50
					dark: {
						DEFAULT: '#E1B168', //300
						on: '#E1B168' //800
					}
				},
				// Main Theme
				  // Light
					lightPrimaryColor: "var(--lightPrimaryColor)",
					lightOverlayPrimaryColor: "var(--lightOverlayPrimaryColor)",
					lightTransparentPrimaryColor: "var(--lightTransparentPrimaryColor)",
					lightTransparentOverlayPrimaryColor: "var(--lightTransparentOverlayPrimaryColor)",
					lightSecondaryColor: "var(--lightSecondaryColor)",
					lightOverlaySecondaryColor: "var(--lightOverlaySecondaryColor)",
					lightTransparentSecondaryColor: "var(--lightTransparentSecondaryColor)",
					lightTransparentOverlaySecondaryColor: "var(--lightTransparentOverlaySecondaryColor)",
					lightBackgroundColor: "var(--lightBackgroundColor)",
					lightOverlayBackgroundColor: "var(--lightOverlayBackgroundColor)",
					lightTransparentBackgroundColor: "var(--lightTransparentBackgroundColor)",
					lightTransparentOverlayBackgroundColor: "var(--lightTransparentOverlayBackgroundColor)",
				  // Dark
					darkPrimaryColor: "var(--darkPrimaryColor)",
					darkOverlayPrimaryColor: "var(--darkOverlayPrimaryColor)",
					darkTransparentPrimaryColor: "var(--darkTransparentPrimaryColor)",
					darkTransparentOverlayPrimaryColor: "var(--darkTransparentOverlayPrimaryColor)",
					darkSecondaryColor: "var(--darkSecondaryColor)",
					darkOverlaySecondaryColor: "var(--darkOverlaySecondaryColor)",
					darkTransparentSecondaryColor: "var(--darkTransparentSecondaryColor)",
					darkTransparentOverlaySecondaryColor: "var(--darkTransparentOverlaySecondaryColor)",
					darkBackgroundColor: "var(--darkBackgroundColor)",
					darkOverlayBackgroundColor: "var(--darkOverlayBackgroundColor)",
					darkTransparentBackgroundColor: "var(--darkTransparentBackgroundColor)",
					darkTransparentOverlayBackgroundColor: "var(--darkTransparentOverlayBackgroundColor)",
				// Main Theme
				

				// Pages Theme
					// Exhibition Theme
						// Light
						exhibitionLightPrimaryColor: "var(--exhibitionLightPrimaryColor)",
						exhibitionLightOverlayPrimaryColor: "var(--exhibitionLightOverlayPrimaryColor)",
						exhibitionLightSecondaryColor: "var(--exhibitionLightSecondaryColor)",
						exhibitionLightOverlaySecondaryColor: "var(--exhibitionLightOverlaySecondaryColor)",
						exhibitionLightBackgroundColor: "var(--exhibitionLightBackgroundColor)",
						exhibitionLightOverlayBackgroundColor: "var(--exhibitionLightOverlayBackgroundColor)",
						// Dark
						exhibitionDarkPrimaryColor: "var(--exhibitionDarkPrimaryColor)",
						exhibitionDarkOverlayPrimaryColor: "var(--exhibitionDarkOverlayPrimaryColor)",
						exhibitionDarkSecondaryColor: "var(--exhibitionDarkSecondaryColor)",
						exhibitionDarkOverlaySecondaryColor: "var(--exhibitionDarkOverlaySecondaryColor)",
						exhibitionDarkBackgroundColor: "var(--exhibitionDarkBackgroundColor)",
						exhibitionDarkOverlayBackgroundColor: "var(--exhibitionDarkOverlayBackgroundColor)",
					// Exhibition Theme

					// News Theme
						// Light
						newsLightPrimaryColor: "var(--newsLightPrimaryColor)",
						newsLightOverlayPrimaryColor: "var(--newsLightOverlayPrimaryColor)",
						newsLightSecondaryColor: "var(--newsLightSecondaryColor)",
						newsLightOverlaySecondaryColor: "var(--newsLightOverlaySecondaryColor)",
						newsLightBackgroundColor: "var(--newsLightBackgroundColor)",
						newsLightOverlayBackgroundColor: "var(--newsLightOverlayBackgroundColor)",
						// Dark
						newsDarkPrimaryColor: "var(--newsDarkPrimaryColor)",
						newsDarkOverlayPrimaryColor: "var(--newsDarkOverlayPrimaryColor)",
						newsDarkSecondaryColor: "var(--newsDarkSecondaryColor)",
						newsDarkOverlaySecondaryColor: "var(--newsDarkOverlaySecondaryColor)",
						newsDarkBackgroundColor: "var(--newsDarkBackgroundColor)",
						newsDarkOverlayBackgroundColor: "var(--newsDarkOverlayBackgroundColor)",
					// News Theme

					// Magazine Theme
						// Light
						magazineLightPrimaryColor: "var(--magazineLightPrimaryColor)",
						magazineLightOverlayPrimaryColor: "var(--magazineLightOverlayPrimaryColor)",
						magazineLightSecondaryColor: "var(--magazineLightSecondaryColor)",
						magazineLightOverlaySecondaryColor: "var(--magazineLightOverlaySecondaryColor)",
						magazineLightBackgroundColor: "var(--magazineLightBackgroundColor)",
						magazineLightOverlayBackgroundColor: "var(--magazineLightOverlayBackgroundColor)",
						// Dark
						magazineDarkPrimaryColor: "var(--magazineDarkPrimaryColor)",
						magazineDarkOverlayPrimaryColor: "var(--magazineDarkOverlayPrimaryColor)",
						magazineDarkSecondaryColor: "var(--magazineDarkSecondaryColor)",
						magazineDarkOverlaySecondaryColor: "var(--magazineDarkOverlaySecondaryColor)",
						magazineDarkBackgroundColor: "var(--magazineDarkBackgroundColor)",
						magazineDarkOverlayBackgroundColor: "var(--magazineDarkOverlayBackgroundColor)",
					// Magazine Theme

					// Video Theme
						// Light
						videoLightPrimaryColor: "var(--videoLightPrimaryColor)",
						videoLightOverlayPrimaryColor: "var(--videoLightOverlayPrimaryColor)",
						videoLightSecondaryColor: "var(--videoLightSecondaryColor)",
						videoLightOverlaySecondaryColor: "var(--videoLightOverlaySecondaryColor)",
						videoLightBackgroundColor: "var(--videoLightBackgroundColor)",
						videoLightOverlayBackgroundColor: "var(--videoLightOverlayBackgroundColor)",
						// Dark
						videoDarkPrimaryColor: "var(--videoDarkPrimaryColor)",
						videoDarkOverlayPrimaryColor: "var(--videoDarkOverlayPrimaryColor)",
						videoDarkSecondaryColor: "var(--videoDarkSecondaryColor)",
						videoDarkOverlaySecondaryColor: "var(--videoDarkOverlaySecondaryColor)",
						videoDarkBackgroundColor: "var(--videoDarkBackgroundColor)",
						videoDarkOverlayBackgroundColor: "var(--videoDarkOverlayBackgroundColor)",
					// Video Theme

					// Publishing Theme
						// Light
						publishingLightPrimaryColor: "var(--publishingLightPrimaryColor)",
						publishingLightOverlayPrimaryColor: "var(--publishingLightOverlayPrimaryColor)",
						publishingLightSecondaryColor: "var(--publishingLightSecondaryColor)",
						publishingLightOverlaySecondaryColor: "var(--publishingLightOverlaySecondaryColor)",
						publishingLightBackgroundColor: "var(--publishingLightBackgroundColor)",
						publishingLightOverlayBackgroundColor: "var(--publishingLightOverlayBackgroundColor)",
						// Dark
						publishingDarkPrimaryColor: "var(--publishingDarkPrimaryColor)",
						publishingDarkOverlayPrimaryColor: "var(--publishingDarkOverlayPrimaryColor)",
						publishingDarkSecondaryColor: "var(--publishingDarkSecondaryColor)",
						publishingDarkOverlaySecondaryColor: "var(--publishingDarkOverlaySecondaryColor)",
						publishingDarkBackgroundColor: "var(--publishingDarkBackgroundColor)",
						publishingDarkOverlayBackgroundColor: "var(--publishingDarkOverlayBackgroundColor)",
					// Publishing Theme

					// Gallery Theme
						// Light
						galleryLightPrimaryColor: "var(--galleryLightPrimaryColor)",
						galleryLightOverlayPrimaryColor: "var(--galleryLightOverlayPrimaryColor)",
						galleryLightSecondaryColor: "var(--galleryLightSecondaryColor)",
						galleryLightOverlaySecondaryColor: "var(--galleryLightOverlaySecondaryColor)",
						galleryLightBackgroundColor: "var(--galleryLightBackgroundColor)",
						galleryLightOverlayBackgroundColor: "var(--galleryLightOverlayBackgroundColor)",
						// Dark
						galleryDarkPrimaryColor: "var(--galleryDarkPrimaryColor)",
						galleryDarkOverlayPrimaryColor: "var(--galleryDarkOverlayPrimaryColor)",
						galleryDarkSecondaryColor: "var(--galleryDarkSecondaryColor)",
						galleryDarkOverlaySecondaryColor: "var(--galleryDarkOverlaySecondaryColor)",
						galleryDarkBackgroundColor: "var(--galleryDarkBackgroundColor)",
						galleryDarkOverlayBackgroundColor: "var(--galleryDarkOverlayBackgroundColor)",
					// Gallery Theme

					// Service Theme
						// Light
						serviceLightPrimaryColor: "var(--serviceLightPrimaryColor)",
						serviceLightOverlayPrimaryColor: "var(--serviceLightOverlayPrimaryColor)",
						serviceLightSecondaryColor: "var(--serviceLightSecondaryColor)",
						serviceLightOverlaySecondaryColor: "var(--serviceLightOverlaySecondaryColor)",
						serviceLightBackgroundColor: "var(--serviceLightBackgroundColor)",
						serviceLightOverlayBackgroundColor: "var(--serviceLightOverlayBackgroundColor)",
						// Dark
						serviceDarkPrimaryColor: "var(--serviceDarkPrimaryColor)",
						serviceDarkOverlayPrimaryColor: "var(--serviceDarkOverlayPrimaryColor)",
						serviceDarkSecondaryColor: "var(--serviceDarkSecondaryColor)",
						serviceDarkOverlaySecondaryColor: "var(--serviceDarkOverlaySecondaryColor)",
						serviceDarkBackgroundColor: "var(--serviceDarkBackgroundColor)",
						serviceDarkOverlayBackgroundColor: "var(--serviceDarkOverlayBackgroundColor)",
				// Pages Theme
				// text colors
				on: '#E1B168' //50

				// pink
				// primary: {"50":"#fdf2f8","100":"#fce7f3","200":"#fbcfe8","300":"#f9a8d4","400":"#f472b6","500":"#ec4899","600":"#db2777","700":"#be185d","800":"#9d174d","900":"#831843"}

				// fuchsia
				// primary: {"50":"#fdf4ff","100":"#fae8ff","200":"#f5d0fe","300":"#f0abfc","400":"#e879f9","500":"#d946ef","600":"#c026d3","700":"#a21caf","800":"#86198f","900":"#701a75"}

				// purple
				// primary: {"50":"#faf5ff","100":"#f3e8ff","200":"#e9d5ff","300":"#d8b4fe","400":"#c084fc","500":"#a855f7","600":"#9333ea","700":"#7e22ce","800":"#6b21a8","900":"#581c87"}

				// violet
				// primary: {"50":"#f5f3ff","100":"#ede9fe","200":"#ddd6fe","300":"#c4b5fd","400":"#a78bfa","500":"#8b5cf6","600":"#7c3aed","700":"#6d28d9","800":"#5b21b6","900":"#4c1d95"}

				// indigo
				// primary: {"50":"#eef2ff","100":"#e0e7ff","200":"#c7d2fe","300":"#a5b4fc","400":"#818cf8","500":"#6366f1","600":"#4f46e5","700":"#4338ca","800":"#3730a3","900":"#312e81"}

				// blue
				// primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a"}

				// sky
				// primary: {"50":"#f0f9ff","100":"#e0f2fe","200":"#bae6fd","300":"#7dd3fc","400":"#38bdf8","500":"#0ea5e9","600":"#0284c7","700":"#0369a1","800":"#075985","900":"#0c4a6e"}

				// cyan
				// primary: {"50":"#ecfeff","100":"#cffafe","200":"#a5f3fc","300":"#67e8f9","400":"#22d3ee","500":"#06b6d4","600":"#0891b2","700":"#0e7490","800":"#155e75","900":"#164e63"}

				// teal
				// primary: {"50":"#f0fdfa","100":"#ccfbf1","200":"#99f6e4","300":"#5eead4","400":"#2dd4bf","500":"#14b8a6","600":"#0d9488","700":"#0f766e","800":"#115e59","900":"#134e4a"}

				// emerald
				// primary: {"50":"#ecfdf5","100":"#d1fae5","200":"#a7f3d0","300":"#6ee7b7","400":"#34d399","500":"#10b981","600":"#059669","700":"#047857","800":"#065f46","900":"#064e3b"}

				// green
				// primary: {"50":"#f0fdf4","100":"#dcfce7","200":"#bbf7d0","300":"#86efac","400":"#4ade80","500":"#22c55e","600":"#16a34a","700":"#15803d","800":"#166534","900":"#14532d"}

				// lime
				// primary: {"50":"#f7fee7","100":"#ecfccb","200":"#d9f99d","300":"#bef264","400":"#a3e635","500":"#84cc16","600":"#65a30d","700":"#4d7c0f","800":"#3f6212","900":"#365314"}

				// yellow
				// primary: {"50":"#fefce8","100":"#fef9c3","200":"#fef08a","300":"#fde047","400":"#facc15","500":"#eab308","600":"#ca8a04","700":"#a16207","800":"#854d0e","900":"#713f12"}

				// amber
				// primary: {"50":"#fffbeb","100":"#fef3c7","200":"#fde68a","300":"#fcd34d","400":"#fbbf24","500":"#f59e0b","600":"#d97706","700":"#b45309","800":"#92400e","900":"#78350f"}

				// orange
				// primary: {"50":"#fff7ed","100":"#ffedd5","200":"#fed7aa","300":"#fdba74","400":"#fb923c","500":"#f97316","600":"#ea580c","700":"#c2410c","800":"#9a3412","900":"#7c2d12"}

				// red
				// primary: {"50":"#fef2f2","100":"#fee2e2","200":"#fecaca","300":"#fca5a5","400":"#f87171","500":"#ef4444","600":"#dc2626","700":"#b91c1c","800":"#991b1b","900":"#7f1d1d"}

				// stone
				// primary: {"50":"#fafaf9","100":"#f5f5f4","200":"#e7e5e4","300":"#d6d3d1","400":"#a8a29e","500":"#78716c","600":"#57534e","700":"#44403c","800":"#292524","900":"#1c1917"}

				// neutral
				// primary: {"50":"#fafafa","100":"#f5f5f5","200":"#e5e5e5","300":"#d4d4d4","400":"#a3a3a3","500":"#737373","600":"#525252","700":"#404040","800":"#262626","900":"#171717"}

				// zinc
				// primary: {"50":"#fafafa","100":"#f4f4f5","200":"#e4e4e7","300":"#d4d4d8","400":"#a1a1aa","500":"#71717a","600":"#52525b","700":"#3f3f46","800":"#27272a","900":"#18181b"}

				// gray
				// primary: {"50":"#f9fafb","100":"#f3f4f6","200":"#e5e7eb","300":"#d1d5db","400":"#9ca3af","500":"#6b7280","600":"#4b5563","700":"#374151","800":"#1f2937","900":"#111827"}

				// slate
				// primary: {"50":"#f8fafc","100":"#f1f5f9","200":"#e2e8f0","300":"#cbd5e1","400":"#94a3b8","500":"#64748b","600":"#475569","700":"#334155","800":"#1e293b","900":"#0f172a"}
			}
		}
	}
};
