import { logoutUser } from '@/lib/auth/logout';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { HeaderProps } from '../../lib/props';

const Header: React.FC<HeaderProps> = ({ logo, onMenuPress }) => {
	const router = useRouter();

	return (
		<View style={styles.header}>
			<Pressable
				onPress={() => router.navigate('/tabs')}
				style={styles.logo}>
				<Image source={logo} style={styles.logo} />
			</Pressable>

			{/* Hamburger menu */}
			<Pressable onPress={onMenuPress} style={styles.hamburger}>
				<MaterialIcons name="menu" size={32} color="grey" />
			</Pressable>

			{/* Logout button */}
			<Pressable onPress={logoutUser} style={styles.logoutButton}>
				<Text style={styles.logoutText}>Logout</Text>
			</Pressable>
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	header: {
		height: 90,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f3f3f3',
		position: 'relative',
	},
	hamburger: {
		position: 'absolute',
		right: 16,
		top: 16,
	},
	logoutButton: {
		position: 'absolute',
		left: 16,
		top: 16,
		padding: 5,
	},
	logoutText: {
		color: 'grey',
		fontWeight: 'bold',
	},
	logo: {
		width: 80,
		height: 76,
	},
});
