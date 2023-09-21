import MailTemplate from '$lib/components/MailTemplate.svelte';
import { render } from 'svelte-email';
import type { RequestHandler } from '@sveltejs/kit';
import { createTransport, type Transporter } from 'nodemailer';

let transport: Transporter;
const email: string = import.meta.env.VITE_PRIVATE_EMAIL;
const password: string = import.meta.env.VITE_PRIVATE_EMAIL_PASSWORD

export const POST = (async ({ locals, params, request }) => {
  const { emailUser, name, message, companyData, exhibition, reserveSeatData, locale } = await request.json();
  if (!transport) {
    transport = createTransport({
      host: "s808.sureserver.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
       tls: {
        rejectUnauthorized: false
      }
    });
  }

  console.log('emailUser', emailUser);
  

  const emailHtml = render({
    template: MailTemplate,
    props: {
      companyData,
      exhibition,
      reserveSeatData

    }
  });

  const worked = await transport.sendMail({
    from: email,
    to: emailUser,
    subject: "Your Seat Reservation Request",
    text: message,
    html: emailHtml,
  });

  
  return new Response(worked.response);
}) satisfies RequestHandler;