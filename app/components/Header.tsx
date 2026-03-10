import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HeaderProps } from '../props';

const Header: React.FC<HeaderProps> = ({ logo, onMenuPress }) => {
	return (
		<View style={styles.header}>
			<Image source={logo} style={styles.logo} />
			<TouchableOpacity onPress={onMenuPress} style={styles.hamburger}>
				<MaterialIcons name="menu" size={28} color="black" />
			</TouchableOpacity>
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	header: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ececec',
		position: 'relative',
	},
	hamburger: {
		position: 'absolute',
		right: 16,
		top: 16,
	},
	logo: {
		width: 80,
		height: 80,
	},
});
