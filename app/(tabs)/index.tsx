// FIRST TAB SECTION
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // for onPress nav to a different tab
import { Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import logo from '../assets/logo/min5.png';
import nature from '../assets/logo/MockupImg.png';
import Header from '../components/Header';

export default function HomeScreen() {
	const router = useRouter();

	const mockupProjects = [
		{
			id: '1',
			title: 'My First Video',
			thumbnail: nature,
		},
		{
			id: '2',
			title: 'My Second Video',
			thumbnail: nature,
		},
		{
			id: '3',
			title: 'My Third Video',
			thumbnail: nature,
		},
		{
			id: '4',
			title: 'My Fourth Video',
			thumbnail: nature,
		},
		{
			id: '5',
			title: 'My 5th Video',
			thumbnail: nature,
		},
		{
			id: '6',
			title: 'My 6th Video',
			thumbnail: nature,
		},
		{
			id: '7',
			title: 'My 7th Video',
			thumbnail: nature,
		},
	];

	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu is pressed')}
			/>

			<ScrollView
				style={styles.scroll}
				contentContainerStyle={{ alignItems: 'center' }}>
				{/* contentContainerStyle = styles all children inside scroll container */}
				<Text style={styles.heading}> MY PROJECTS </Text>
				{mockupProjects.map((mockupProject) => (
					<Pressable
						key={mockupProject.id}
						style={styles.videoCard}
						onPress={() =>
							router.navigate(
								`projects?projectId=${mockupProject.id}`, // Projects.tsx (2. tab) can read the projectId & know which project to load
							)
						}>
						<Image
							source={mockupProject.thumbnail}
							style={styles.image}
						/>
						<Text style={styles.text}> {mockupProject.title} </Text>
					</Pressable>
				))}

				{/* 'CREATE NEW PROJECT BUTTON ON THE BOTTOM */}
				<Pressable
					onPress={() => router.navigate('projects')}
					style={styles.button}>
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

const styles = StyleSheet.create({
	heading: {
		color: 'black',
		fontFamily: 'Times New Roman',
		fontSize: 25,
		marginTop: 30,
		marginBottom: 20,
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
});
