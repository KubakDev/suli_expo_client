import MailTemplate from '$lib/components/MailTemplate.svelte';
import { render } from 'svelte-email';
import type { RequestHandler } from '@sveltejs/kit';
import { createTransport, type Transporter } from 'nodemailer';

let transport: Transporter;
const email:string = import.meta.env.VITE_PRIVATE_EMAIL;
const password:string = import.meta.env.VITE_PRIVATE_EMAIL_PASSWORD

export const POST = (async ({locals, params, request}) => {
 
  const { emailUser, name, message } = await request.json();
  if(!transport) {
    transport = createTransport({
      service: 'gmail',
      port: 465,
       auth: {
        user: email,
        pass: password
       },
       tls: {
        rejectUnauthorized: false
      }
    });
  }

  const emailHtml = render({
    template: MailTemplate,
    props: {
      description: message,
    }
  });

  const worked = await transport.sendMail({
    from: emailUser,
    to: email,
    subject: name,
    text: message,
    html: emailHtml,
  });

  return new Response(worked.response);
}) satisfies RequestHandler;