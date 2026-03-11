import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
	return (
		<SafeAreaView style={styles.safeView}>
			<Tabs>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Home',
						headerShown: false /* hides default boring title header */,
					}}
				/>
				<Tabs.Screen
					name="projects"
					options={{
						title: 'Projects',
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="export"
					options={{
						title: 'Export',
						headerShown: false,
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeView: {
		flex: 1,
	},
});
