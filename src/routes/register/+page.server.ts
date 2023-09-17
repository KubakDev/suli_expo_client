
import { AuthApiError } from '@supabase/supabase-js';
import { fail, type Actions, redirect } from '@sveltejs/kit';


export const actions: Actions = {
	register: async ({ request, locals }) => {
		console.log('registering');
		const body = Object.fromEntries(await request.formData());

		const { data: existingUser, error: userError } = await locals.supabase
			.from('company')
			.select('email')
			.eq('email', body.email as string)
			.limit(1);

		console.log('existingUser', existingUser)
		console.log('userError', userError)
		if (userError) {
			return fail(500, {
				errors: 'this user exist already'
			});
		}

		if (existingUser && existingUser.length > 0) {
			return {
				errors:
					'User exists with this email. If you recognize this email, Click on the login button.'
			};
		}
		console.log('existingUsersdf dsfg sdg ')
		const { data, error: err } = await locals.supabase.auth.signUp({
			email: body.email as string,
			password: body.password as string,
			options: {
				emailRedirectTo: `${import.meta.env.VITE_BASE_URL}/login`
			}
		});
		console.log('email is kak rovar', data) 
		console.log('email is kak rovar error', err) 
		if (err) {

			if (err instanceof AuthApiError && err.status === 400) {
				return {
					errors: 'Invalid Email or Password'
				};
			}
		}

		return {
			email: body.email,
			password: body.password,
			uid: data?.user?.id
		};
	}
};
