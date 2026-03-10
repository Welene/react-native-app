import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	return (
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
	);
}
