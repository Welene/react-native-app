// helper file that connects to backend (supabase) with env --> exports the client (so it can be used in the app)
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'expo-sqlite/localStorage/install';
// import 'react-native-dotenv';
import 'react-native-url-polyfill/auto';

const projectURL = Constants.expoConfig?.extra?.supabaseUrl;
const projectAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient(projectURL, projectAnonKey, {
	auth: {
		storage: localStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
