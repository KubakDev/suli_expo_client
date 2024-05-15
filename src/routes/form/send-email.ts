import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function generateQRCode(text: string): Promise<string> {
	const filePath = path.join('/tmp', 'qrcode.png');
	await QRCode.toFile(filePath, text, {
		type: 'png',
		margin: 2,
		width: 300
	});
	return filePath;
}

export async function POST({ request }:any) {
	try {
		const { email, id } = await request.json();
		const adminEmail = process.env.VITE_PRIVATE_EMAIL;
		const password = process.env.VITE_PRIVATE_EMAIL_PASSWORD;

		// Generate QR code and get the file path
		const qrCodePath = await generateQRCode(id.toString());

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: adminEmail,
				pass: password
			}
		});

		const mailOptions = {
			from: `"Your Name" <${adminEmail}>`,
			to: email,
			subject: 'Your QR Code',
			text: 'Please find your QR code attached.',
			attachments: [
				{
					filename: 'qrcode.png',
					path: qrCodePath
				}
			]
		};

		const info = await transporter.sendMail(mailOptions);

		// Delete the QR code file after sending the email
		fs.unlinkSync(qrCodePath);

		return json({ message: 'Email sent successfully', response: info.response });
	} catch (error) {
		console.error('Failed to send email:', error);
		return json({ error: 'Failed to send email', details: error }, { status: 500 });
	}
}
