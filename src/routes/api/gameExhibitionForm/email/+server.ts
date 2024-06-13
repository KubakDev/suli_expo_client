import nodemailer from 'nodemailer';
import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { get } from 'svelte/store';
import { locale as $locale } from '$lib/i18n/i18n-svelte';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, qrCode } = await request.json();
		const adminEmail: string = import.meta.env.VITE_PRIVATE_EMAIL;
		const password: string = import.meta.env.VITE_PRIVATE_EMAIL_PASSWORD;

		const currentLocale = get($locale);
		if (!adminEmail || !password) {
			throw new Error('Email credentials are not set');
		}

		// Fetch profile data
		const { data: profiles, error } = await supabase
			.from('userProfileGameExhibition')
			.select('*')
			.eq('id', 1)
			.single();

		if (error) {
			console.error('Error fetching profile:', error);
			return json({ error: 'Error fetching profile data' }, { status: 500 });
		}

		const emailSubject =
			profiles && profiles.emailSubject
				? JSON.parse(profiles.emailSubject)[currentLocale]
				: 'sulyExpo';
		const emailDescription =
			profiles && profiles.emailDescription
				? JSON.parse(profiles.emailDescription)[currentLocale]
				: 'Your QR Code';

		const transporter = nodemailer.createTransport({
			host: 's808.sureserver.com',
			port: 465,
			secure: true,
			auth: {
				user: adminEmail,
				pass: password
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		const mailOptions = {
			from: `"SulyExpo" <${adminEmail}>`,
			to: email,
			subject: emailSubject,
			html: `<p>${emailDescription}</p><img src="${qrCode}" alt="QR Code" />`
		};

		const info = await transporter.sendMail(mailOptions);

		return json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error('Error sending email:', error);
		return json({ error: 'Error sending email' }, { status: 500 });
	}
};
