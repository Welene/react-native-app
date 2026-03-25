import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { registerUser } from '../lib/auth/register';
import { supabase } from '../lib/supabase';

export default function RegisterLoginPage() {
	const router = useRouter();
	const [mode, setMode] = useState<'register' | 'login'>('register'); // state for changing between register or login section on modal page (default: register)
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		setUsername('');
		setEmail('');
		setPassword('');
	}, [mode]); // resets input fields when switching between reg or login section

	const handleRegister = async () => {
		const result = await registerUser({ username, email, password });
		if (result.success) {
			alert('Registration successful! You can log in now.');
			setMode('login'); // after reg - goes to login section
		} else {
			alert(result.error);
		}
	};

	const handleLogin = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) alert(error.message);
		else if (data.session) router.navigate('/tabs/index'); // navs to first page when logging in
	};

	// --------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------- RENDER STUFF ON PAGE SECTION -------------------------------------------------------

	return (
		<View style={styles.container}>
			{mode === 'register' && (
				<>
					<Text style={styles.heading}>Register</Text>
					<TextInput
						style={styles.input}
						placeholder="Username"
						value={username}
						onChangeText={setUsername}
					/>
					<TextInput
						style={styles.input}
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
					/>
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>

					<Pressable onPress={handleRegister} style={styles.button}>
						<LinearGradient
							colors={['#ffc26d', '#fc8ed2']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.gradient}>
							<Text style={styles.buttonText}>Register</Text>
						</LinearGradient>
					</Pressable>

					<Text
						style={styles.switchText}
						onPress={() => setMode('login')}>
						Already have an account? Login
					</Text>
				</>
			)}

			{mode === 'login' && (
				<>
					<Text style={styles.heading}>Login</Text>
					<TextInput
						style={styles.input}
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
					/>
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>

					<Pressable onPress={handleLogin} style={styles.button}>
						<LinearGradient
							colors={['#ffc26d', '#fc8ed2']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.gradient}>
							<Text style={styles.buttonText}>Login</Text>
						</LinearGradient>
					</Pressable>

					<Text
						style={styles.switchText}
						onPress={() => setMode('register')}>
						Don't have an account? Register
					</Text>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	heading: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
		fontSize: 16,
	},
	button: {
		borderRadius: 8,
		overflow: 'hidden',
		marginTop: 10,
		marginBottom: 10,
	},
	gradient: {
		padding: 15,
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	switchText: {
		textAlign: 'center',
		color: '#555',
		marginTop: 10,
		textDecorationLine: 'underline',
	},
});
