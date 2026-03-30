import * as NavigationBar from 'expo-navigation-bar';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // neeed to wrap tab 2 in it to be able to drag clips in timeline
import { SafeAreaView } from 'react-native-safe-area-context';
import cut from '../assets/icons/cut.png';
import exportIcon from '../assets/icons/export.png';
import project from '../assets/icons/project.png';

export default function TabLayout() {
	useEffect(() => {
		NavigationBar.setVisibilityAsync('hidden');
		NavigationBar.setBehaviorAsync('overlay-swipe'); // HIDES PHONE MENU - but only works for android... So just get an android if you don't have one :--)
	}, []);

	return (
		<SafeAreaView style={styles.safeView} edges={['top', 'left', 'right']}>
			{/* not bottom: hides the phone default menu under the app's tab footer */}
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Tabs
					screenOptions={{
						tabBarActiveTintColor: '#ffb3d9',
						tabBarInactiveTintColor: 'grey',
						tabBarShowLabel: false,
						tabBarIconStyle: {
							marginTop: 10,
						},
					}}>
					<Tabs.Screen
						name="index"
						options={{
							title: 'Home',
							headerShown: false /* hides default boring title header */,
							tabBarIcon: ({ color, size }) => (
								<Image
									source={project}
									style={{
										width: size,
										height: size,
										tintColor: color,
									}}
								/>
							),
						}}
					/>

					<Tabs.Screen
						name="projects"
						options={{
							title: 'Projects',
							headerShown: false,
							tabBarIcon: ({ color, size }) => (
								<Image
									source={cut}
									style={{
										width: size,
										height: size,
										tintColor: color,
									}}
								/>
							),
						}}
					/>

					<Tabs.Screen
						name="export"
						options={{
							title: 'Export',
							headerShown: false,
							tabBarIcon: ({ color, size }) => (
								<Image
									source={exportIcon}
									style={{
										width: size,
										height: size,
										tintColor: color,
									}}
								/>
							),
						}}
					/>
				</Tabs>
			</GestureHandlerRootView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeView: {
		flex: 1,
	},
});
