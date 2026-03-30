import { supabase } from '../supabase';

type UserProps = {
	username: string;
	email: string;
	password: string;
};

export const registerUser = async ({
	username,
	email,
	password,
}: UserProps) => {
	try {
		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
		});

		if (authError) return { error: authError.message };
		if (!data.user) return { error: 'Cannot register user' };

		const newUser = data.user;

		const { error: profileError } = await supabase.from('profiles').insert({
			id: newUser.id,
			username: username,
		});
		if (profileError) return { error: profileError.message };

		return { success: true };
	} catch (error: any) {
		return { error: error.message };
	}
};
