import nodemailer from 'nodemailer';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }: any) => {
	try {
		const { email, qrCode } = await request.json();
		console.log('Received request to send email to:', email);
		console.log('QR Code:', qrCode);

		// const adminEmail: string = import.meta.env.VITE_PRIVATE_EMAIL;
		// const password: string = import.meta.env.VITE_PRIVATE_EMAIL_PASSWORD;
		const adminEmail = 'shajwan.namiq2023@gmail.com';
		const password = 'shajwan2023SALIH';

		if (!adminEmail || !password) {
			throw new Error('Email credentials are not set');
		}

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: adminEmail,
				pass: password
			}
		});

		const mailOptions = {
			from: `"Your Name" <${adminEmail}>`,
			to: email,
			subject: 'Your QR Code',
			html: `<p>Scan this QR code:</p><img src="${qrCode}" alt="QR Code" />`
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ', info.response);

		return json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error('Error sending email:', error);
		return json({ error: 'Error sending email' }, { status: 500 });
	}
};
