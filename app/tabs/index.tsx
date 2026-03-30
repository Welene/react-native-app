// FIRST TAB SECTION
import { loadProject } from '@/lib/projects';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // for onPress nav to a different tab
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import logo from '../assets/logo/min5.png';
import nature from '../assets/logo/MockupImg.png';
import Header from '../components/Header';
import { Project } from '../props';

export default function HomeScreen() {
	const router = useRouter();
	const [projects, setProjects] = useState<Project[]>([]);

	// LOAD ALL SAVED PROJECTS BY USER
	const loadAllProjects = async () => {
		// get saved project IDs
		const listJson = await AsyncStorage.getItem('projects-list');
		const list: string[] = listJson ? JSON.parse(listJson) : [];
		// load each project individually

		const {
			data: { user },
		} = await supabase.auth.getUser();

		// USER WILL EXIST when visiting home page vvv - ts will be happy :)
		const currentUser = user!;

		const loaded = await Promise.all(list.map((id) => loadProject(id)));
		setProjects(
			loaded.filter(
				(p): p is Project => p !== null && p.userId === currentUser.id,
			),
		);
	};

	useEffect(() => {
		loadAllProjects();
	}, []);

	useFocusEffect(
		// auto updates homepage with projects (even after first time loading)
		useCallback(() => {
			loadAllProjects();
		}, []),
	);

	// --------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------- RENDER STUFF ON PAGE SECTION -------------------------------------------------------

	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu pressed')}
			/>

			<ScrollView
				style={styles.scroll}
				contentContainerStyle={{ alignItems: 'center' }}>
				<Text style={styles.heading}> MY PROJECTS </Text>

				{projects.map((project) => (
					<Pressable
						key={project.id}
						style={styles.videoCard}
						onPress={() =>
							router.navigate(
								`/tabs/projects?projectId=${project.id}`,
							)
						}>
						<Image
							source={
								project.clips[0]?.uri
									? { uri: project.clips[0].uri }
									: nature
							}
							style={styles.image}
						/>
						<Text style={styles.text}>{project.title}</Text>
					</Pressable>
				))}

				<Pressable
					onPress={() =>
						router.navigate('/tabs/projects?newProject=true')
					}
					style={[styles.button, styles.shadowBox]}>
					<LinearGradient
						colors={['#ffc26d', '#fc8ed2']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={styles.gradient}>
						<Text style={styles.buttonText}>
							Start new project +
						</Text>
					</LinearGradient>
				</Pressable>
			</ScrollView>
		</>
	);
}

// --------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------- STYLES SECTION ---------------------------------------------------------------------

const styles = StyleSheet.create({
	heading: {
		color: 'black',
		fontSize: 25,
		marginTop: 30,
		marginBottom: 35,
		fontFamily: 'LibreBaskerville_400Regular',
		letterSpacing: 1.2,
	},
	image: {
		width: '100%',
		height: 180,
		opacity: 0.8,
		borderRadius: 8,
	},
	scroll: {
		flex: 1,
	},
	text: {
		fontFamily: 'calibri',
		fontSize: 20,
		color: 'white',
		position: 'absolute',
		right: 15,
		top: 10,
		fontWeight: 'bold',
	},
	videoCard: {
		width: '90%',
		marginVertical: 15,
		borderRadius: 8,
	},
	button: {
		width: '90%',
		borderRadius: 8,
		marginTop: 50,
		marginBottom: 100,
		overflow: 'hidden',
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	gradient: {
		padding: 22,
		alignItems: 'center',
	},
	shadowBox: {
		// iOS
		shadowColor: '#000',

		// Android
		elevation: 4,
	},
});
