import {
	LibreBaskerville_400Regular,
	useFonts,
} from '@expo-google-fonts/libre-baskerville';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RegisterLoginPage from './modal';

export default function RootLayout() {
	const [session, setSession] = useState<any>(null);

	const [fontsLoaded] = useFonts({
		LibreBaskerville_400Regular,
	});

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
	if (!session) return <RegisterLoginPage />;

	return (
		<>
			<Stack>
				<Stack.Screen name="tabs" options={{ headerShown: false }} />
			</Stack>
			<StatusBar style="auto" />
		</>
	);
}
