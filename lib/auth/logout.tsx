import { supabase } from '../supabase';

export const logoutUser = async () => {
	await supabase.auth.signOut();
};
