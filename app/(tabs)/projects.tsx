// SECOND TAB SECTION

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import logo from '../assets/logo/min5.png';
import AddVideoBtn from '../components/AddVideoBtn';
import Header from '../components/Header';
import NewClipContainer from '../components/NewClipContainer';
import { Clip } from '../props';

export default function TabTwoScreen() {
	const [clips, setClips] = useState<Clip[]>([]); // uses the prop Clip - ts knows clips is an [] of Clip objects

	const chooseImages = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			// opens phone gallery where you  can choose img/vid
			mediaTypes: 'videos',
			allowsEditing: false,
			quality: 1,
		});

		if (!result.canceled) {
			console.log(result); // log the video metadata

			const clipData = result.assets[0]; // saves the video meta data in clipData

			const newClip: Clip = {
				id: Date.now(),
				uri: clipData.uri,
				duration: clipData.duration || 0,
				fileName: clipData.fileName || 'unknown',
				startTime: 0,
				segmentLength: 1,
			};

			setClips((prevClips) => {
				const updatedArray = [...prevClips, newClip];
				console.log('UPDATED CLIPS ARRAY', updatedArray);
				return updatedArray;
			}); // update state - copy prev array & add new clip in []
		} else {
			alert('Choose an image/video first');
		}
	};

	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu is pressed')}
			/>
			<View style={styles.preview}>
				<Text>PREVIEW SECTION AKA BIG VIDEO</Text>
				{/* STOR PREVIEW VIDEO BOKS - SPILLER AV VIDEOER MAN HAR LAGT TIL OM MAN TRYKKER PÅ PLAY */}
			</View>
			<ScrollView style={styles.scrollClips} horizontal={true}>
				<View style={styles.collection}>
					{clips.map((clip) => {
						return (
							<NewClipContainer key={clip.id} uri={clip.uri} />
						);
					})}
				</View>
			</ScrollView>
			<View style={styles.addVideo}>
				<AddVideoBtn label="Add video" onPress={chooseImages} />
			</View>
			<View style={styles.timeline}></View>
		</>
	);
}

const styles = StyleSheet.create({
	preview: {
		width: '100%',
		height: 170,
		backgroundColor: 'pink',
	},
	collection: {
		flexDirection: 'row',
		margin: 10,
		// width: '90%',
		// height: 100,
	},
	addVideo: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	scrollClips: {
		height: 50,
	},
	timeline: {
		width: '100%',
		height: 150,
	},
});
