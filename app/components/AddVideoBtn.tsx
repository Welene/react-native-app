import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { addVideoBtn } from '../../lib/props';

export function AddVideoBtn({ onPress }: addVideoBtn) {
	return (
		<Pressable style={styles.addButton} onPress={onPress}>
			<Text style={styles.buttonText}>+</Text>
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
		paddingBottom: 4,
		position: 'absolute',
		bottom: 0,
		right: 15,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		backgroundColor: 'pink',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 4,
	},
	buttonText: {
		color: 'white',
		fontSize: 25,
		fontWeight: 'bold',
	},
});
