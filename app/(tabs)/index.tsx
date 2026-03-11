// FIRST TAB SECTION
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import logo from '../assets/logo/min1.png';
import nature from '../assets/logo/MockupImg.png';
import Header from '../components/Header';

export default function HomeScreen() {
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

				{mockupProjects.map((mockupProject) => (
					<View key={mockupProject.id} style={styles.videoCard}>
						<Image
							source={mockupProject.thumbnail}
							style={styles.image}
						/>
						<Text style={styles.text}>{mockupProject.title}</Text>
					</View>
				))}
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: 100,
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
});
