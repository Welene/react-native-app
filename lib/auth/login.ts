import { supabase } from '../supabase';

export const loginUser = async (email: string, password: string) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) return { error: error.message };
	if (!data.session) return { error: 'Login failed' };

	return { success: true, session: data.session };
};
