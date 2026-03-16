// SECOND TAB SECTION

import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';
import {
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'; // in Native you have to import all elements you use
import logo from '../assets/logo/min5.png';
import AddVideoBtn from '../components/AddVideoBtn';
import Header from '../components/Header';
import { Clip } from '../props';

export default function TabTwoScreen() {
	const [clips, setClips] = useState<Clip[]>([]); // uses the prop Clip - ts knows clips is an [] of Clip objects
	const [currentlyClicked, setCurrentlyClicked] = useState<Clip | null>(null); // remembers which clip is clicked so it shows up in previewVideo - overrides latestClip

	const clipToPreview = currentlyClicked ?? clips[clips.length - 1] ?? null;
	const previewPlayer = useVideoPlayer(clipToPreview?.uri ?? '');

	const chooseImages = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			// opens phone gallery where you  can choose img/vid
			mediaTypes: 'videos',
			allowsEditing: false,
			allowsMultipleSelection: true,
			quality: 1,
		});

		// video assets/metadata --> clip objects
		if (!result.canceled) {
			const newClips: Clip[] = result.assets.map((asset) => ({
				// Clip[] using the prop, but telling it to expect an array of clips
				id: Date.now() + Math.random(), // id = time now in ms + (because several videos can be selected at the same ms) Math.random gives additional random number in the id
				uri: asset.uri,
				duration: asset.duration || 0,
				fileName: asset.fileName || 'unknown',
				startTime: 0,
				segmentLength: 1,
			})); // metadata --> saved in newClips

			setClips((prevClips) => {
				const updatedArray = [...prevClips, ...newClips]; // adds new clips on top of previous clip [] // '...' = takes new videos & pulls them out of the new videos [] (so there are no [] nested inside [])
				console.log('UPDATED CLIPS ARRAY', updatedArray);
				return updatedArray; // returns the updated [] to 'clips' in useState
			});

			if (!currentlyClicked) {
				setCurrentlyClicked(newClips[newClips.length - 1]);
			}
		} else {
			alert('Choose an image/video first');
		}
	};

	// helper for thumbnails in mini clips - MOVE THIS ONE OUT TO A HELPER FILE/FOLDER LATER FOR MORE CLEAN STRUCTURE - do not forget!
	const [thumbnails, setThumbnails] = useState<{ [id: number]: string }>({});

	useEffect(() => {
		clips.forEach(async (clip) => {
			if (!thumbnails[clip.id]) {
				try {
					const { uri } = await VideoThumbnails.getThumbnailAsync(
						clip.uri,
						{ time: 0 },
					);
					setThumbnails((prev) => ({ ...prev, [clip.id]: uri }));
				} catch (error) {
					console.warn(
						'Could not generate thumbnail for mini-video',
						error,
					);
				}
			}
		});
	}, [clips]);

	// --------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------- RENDER STUFF ON PAGE SECTION -------------------------------------------------------

	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu is pressed')}
			/>
			<View style={styles.preview}>
				<LinearGradient
					colors={['#ffc26d', '#fc8ed2']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}>
					{clipToPreview ? (
						<VideoView
							player={previewPlayer}
							style={styles.previewVideo}
						/>
					) : (
						<Text>Select a video to preview</Text>
					)}
				</LinearGradient>
			</View>
			<ScrollView style={styles.scrollClips} horizontal={true}>
				<View style={styles.collection}>
					{clips.map((clip) => {
						return (
							<Pressable
								key={clip.id}
								onPress={() => setCurrentlyClicked(clip)}>
								{thumbnails[clip.id] ? (
									<Image
										source={{
											uri: thumbnails[clip.id],
										}}
										style={{
											width: 100,
											height: 100,
											borderRadius: 8,
											margin: 10,
										}}
									/>
								) : (
									<LinearGradient
										colors={['#ffc26d', '#fc8ed2']}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 0 }}
										style={{
											width: 100,
											height: 100,
											borderRadius: 8,
											margin: 10,
										}}>
										<View // placeholder mini thumbnail - shows before thumbnail loads
											style={{
												width: 100,
												height: 100,
												borderRadius: 8,
												margin: 10,
											}}></View>
									</LinearGradient>
								)}
							</Pressable>
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

// --------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------- STYLES SECTION ---------------------------------------------------------------------

const styles = StyleSheet.create({
	preview: {
		width: '100%',
		height: 170,
		backgroundColor: 'pink',
	},
	previewVideo: {
		width: '100%',
		height: '100%',
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
		height: 150,
	},
	timeline: {
		width: '100%',
		height: 150,
	},
});
