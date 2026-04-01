import {
	LibreBaskerville_400Regular,
	useFonts,
} from '@expo-google-fonts/libre-baskerville';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RegisterLoginPage from './modal';

export default function RootLayout() {
	const [session, setSession] = useState<any>(null);
	const [fontsLoaded] = useFonts({ LibreBaskerville_400Regular });
	const [initialUrl, setInitialUrl] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const getInitialUrl = async () => {
			const url = await Linking.getInitialURL();
			console.log('Initial deep link URL:', url);
			setInitialUrl(url);
		};
		getInitialUrl();
	}, []);

	// Check Supabase session
	useEffect(() => {
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			const session = data.session;

			if (!session) return setSession(null);

			const { data: userData, error } = await supabase.auth.getUser();
			if (error || !userData.user) {
				await supabase.auth.signOut();
				setSession(null);
			} else {
				setSession(session);
			}
		};

		checkSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => setSession(session),
		);

		return () => listener.subscription.unsubscribe();
	}, []);

	if (!fontsLoaded) return null;

	// Show modal first if no session
	if (!session) {
		return (
			<RegisterLoginPage
				onLoginSuccess={() => {
					router.replace('/tabs');
				}}
			/>
		);
	}

	return (
		<>
			<Stack>
				<Stack.Screen name="tabs" options={{ headerShown: false }} />
			</Stack>
			<StatusBar style="auto" />
		</>
	);
}
