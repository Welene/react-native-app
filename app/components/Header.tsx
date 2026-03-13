import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { HeaderProps } from '../props';

const Header: React.FC<HeaderProps> = ({ logo, onMenuPress }) => {
	return (
		<View style={styles.header}>
			<Image source={logo} style={styles.logo} />
			<Pressable onPress={onMenuPress} style={styles.hamburger}>
				<MaterialIcons name="menu" size={32} color="grey" />
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
	logo: {
		width: 80,
		height: 76,
	},
});
