import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
				}}
			/>
			<Tabs.Screen
				name="projects"
				options={{
					title: 'Projects',
				}}
			/>
			<Tabs.Screen
				name="export"
				options={{
					title: 'Export',
				}}
			/>
		</Tabs>
	);
}
