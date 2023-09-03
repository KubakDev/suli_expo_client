// import { AuthApiError } from "@supabase/supabase-js";

import { AuthApiError } from '@supabase/supabase-js';
import { fail, type Actions, redirect } from '@sveltejs/kit';

// /** @type {import('./$types').Actions} */
// export const actions = {
//     signup: async ({ request, locals: { supabase } }) => {
//         const formData = await request.formData();
//         const email = formData.get('email') as string;
//         const password = formData.get('password') as string;

//         if (!email && !password) {
//             return respondWithError(email, password, 'Email and password are required.');
//         }

//         if (!email) {
//             return respondWithError(email, password, 'Email is required.');
//         }

//         if (!password) {
//             return respondWithError(email, password, 'Password is required.');
//         }

//         // Attempt to sign up the user
//         const { data, error } = await supabase.auth.signUp({
//             email,
//             password
//         });

//         if (error) {
//             return respondWithError(email, password, error.message);
//         }

//         // If the signup was successful, the user will need to verify their email before signing in
//         // You might want to send them to a page informing them to check their email
//         return { status: 303, headers: { Location: 'check-email' } };
//     },
// };

/**
 * A helper function to streamline the error responses.
 */
// function respondWithError(email: string, password: string, errorMessage: string) {
//     console.error(errorMessage);
//     return {
//         email,
//         password,
//         errors: errorMessage
//     };
// }

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		// Step 1: Check if user with this email already exists
		const { data: existingUser, error: userError } = await locals.supabase
			.from('users')
			.select('email')
			.eq('email', body.email as string)
			.limit(1);

		if (userError) {
			console.error(userError);
			return fail(500, {
				errors: 'Server error. Please try again later'
			});
		}

		if (existingUser && existingUser.length > 0) {
			// User with this email already exists
			return {
				errors:
					'User exists with this email. If you recognize this email, Click on the login button.'
			};
		}

		// Step 2: Proceed with sign up
		const { data, error: err } = await locals.supabase.auth.signUp({
			email: body.email as string,
			password: body.password as string,
            options: {
                emailRedirectTo: 'http://localhost:5173/login' // you will have to make the project part dynamic in whichever way the framework you are using allows you to do this.
              } 
		});

		if (err) {
			 
			if (err instanceof AuthApiError && err.status === 400) {
				return {
					errors: 'Invalid Email or Password'
				};
			}
			return fail(500, {
				errors: 'Server error. Please try again later'
			});
		}

		// Step 3: Save UID and email in a separate table
		const { error: insertError } = await locals.supabase
			.from('company') // Replace with the name of your table
			.insert([
				{
					type: null,
					logo_url: null,
					phone_number: null,
					email: body.email,
					uid: data?.user?.id,
					created_at: new Date()
				}
			]);
            

		if (insertError) {
			console.error(insertError);
			return fail(500, {
				errors: 'Server error while saving the company data.'
			});
		}

         const userData = await locals.supabase
			.from('users') // Replace with the name of your table
			.insert([
				{
					first_name: null,
					last_name: null,
					phone_number: null,
					email: body.email,
					uid: data?.user?.id,
					created_at: new Date()
				}
			]);

            if(!userData){
                return fail(500, {
                    errors: 'Server error while saving the user data.'
                });
            }

		return {
			email: body.email,
			password: body.password,
            uid: data?.user?.id
		};
	}
};
