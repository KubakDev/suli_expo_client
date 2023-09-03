
import { AuthApiError } from "@supabase/supabase-js";
import { fail, json, redirect, } from "@sveltejs/kit";


/** @type {import('./$types').Actions} */
export const actions = {
    signin: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email) {
            const errors = 'email required';
            return {
                email,
                password,
                errors
            };
        }
        if (!password) {
            const errors = 'password required';
            return {
                email,
                password,
                errors
            };
        }

        if (!email && !password) {
            const errors = 'email and password required';
            return {
                email,
                password,
                errors
            };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            if (error instanceof AuthApiError && error.status === 400) {
                const errors = error.message;
                return {
                    email,
                    password,
                    errors
                };
            }
            const errors = error.message;
            const errorCode = error.code;
            return {
                email,
                password,
                errors,
                errorCode
            };
        } else {


            throw redirect(303, 'company-registration');

        }
    },

    signout: async ({ locals: { supabase } }) => {
        await supabase.auth.signOut();
        throw redirect(303, '/');
    }
};

