import nodemailer, { createTransport, type Transporter } from 'nodemailer';
import { json } from '@sveltejs/kit';
import QRCode from 'qrcode';
import fs from 'fs';
import os from 'os';
import path from 'path';

let transport: Transporter;

const tempDir = os.tmpdir(); // Get the temporary directory
async function generateQRCode(text: string): Promise<string> {
	const filePath = path.join(tempDir, 'qrcode.png'); // Create a path in the temporary directory
	await QRCode.toFile(filePath, text, {
		type: 'png',
		margin: 2,
		width: 300
	});
	return filePath;
}

export async function POST({ request }: any) {
	try {
		const { email, id } = await request.json();
		const adminEmail = 'shajwan.namiq2023@gmail.com';
		const password = 'shajwan2023SALIH';

		if (!adminEmail || !password) {
			throw new Error('Email credentials are not set in environment variables');
		}

		const qrCodePath = await generateQRCode(id.toString());

		if (!transport) {
			transport = createTransport({
				host: 'smtp.gmail.com',
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
		}

		const mailOptions = {
			from: `"Your Name" <${adminEmail}>`,
			to: email,
			subject: 'Your QR Code',
			text: 'Please find your QR code attached.',
			attachments: [{ filename: 'qrcode.png', path: qrCodePath }]
		};

		const info = await transport.sendMail(mailOptions);
		fs.unlinkSync(qrCodePath);

		return json({ message: 'Email sent successfully', response: info.response });
	} catch (error) {
		console.error('Failed to send email:', error);
		return json(
			{ error: 'Failed to send email', details: error },
			{ status: 500 }
		);
	}
}
