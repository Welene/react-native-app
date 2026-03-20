import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { addVideoBtn } from '../props';

export function AddVideoBtn({ label, onPress }: addVideoBtn) {
	return (
		<Pressable style={styles.addButton} onPress={onPress}>
			<LinearGradient
				colors={['#ffc26d', '#fc8ed2']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={styles.gradient}>
				<Text style={styles.buttonText}>+</Text>
			</LinearGradient>
		</Pressable>
	);
}
export default AddVideoBtn;

const styles = StyleSheet.create({
	addButton: {
		width: 48,
		height: 48,
		borderRadius: 8,
		marginTop: 20,
		marginBottom: 20,
		right: 20,
		overflow: 'hidden',
	},
	buttonText: {
		color: 'white',
		fontSize: 28,
		fontWeight: 'bold',
	},
	gradient: {
		padding: 6,
		alignItems: 'center',
	},
});
