import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RegisterLoginPage from './modal';

export default function RootLayout() {
	const [session, setSession] = useState<any>(null); // usestate for session change

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => setSession(data.session)); // checks if a session is already active AKA if someone registered is using the app

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => setSession(session), // updates session when auth state changes in supabase // changes on login/logout
		);
		return () => listener.subscription.unsubscribe();
	}, []);

	if (!session) return <RegisterLoginPage />; // show modal if not logged in (no active session exists)

	return (
		<>
			<Stack>
				<Stack.Screen name="tabs" options={{ headerShown: false }} />
			</Stack>
			<StatusBar style="auto" />
		</>
	);
}
