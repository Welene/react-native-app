// SECOND TAB SECTION <-- more like an edit page, but it has the name projects now kkkkk
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';
import {
	Image,
	ImageSourcePropType,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'; // in Native you have to import all elements you use
import DraggableFlatList from 'react-native-draggable-flatlist';
import iconDuration from '../assets/icons/duration.png';
import iconExport from '../assets/icons/export.png';
import iconMusic from '../assets/icons/music.png';
import iconMute from '../assets/icons/mute.png';
import pause from '../assets/icons/pause.png';
import playBtn from '../assets/icons/play.png';
import logo from '../assets/logo/min5.png';
import AddVideoBtn from '../components/AddVideoBtn';
import Header from '../components/Header';
import { Clip } from '../props';

// --------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------- THE-WHOLE-ASS-SCREEN SECTION -------------------------------------------------------
export default function TabTwoScreen() {
	// state of all clips, uses the Clip prop
	const [clips, setClips] = useState<Clip[]>([]);

	//state keeps track of: currently clicked mini clip, last added mini clip & if timeline clips are being played right now or not
	const [currentlyClicked, setCurrentlyClicked] = useState<Clip | null>(null); // remembers which clip is clicked so it shows up in previewVideo - overrides latestClip
	const [timelineClips, setTimelineClips] = useState<Clip[]>([]); // clips that are added to the timeline - starts as empty [] and gets filled with clips that are added to timeline
	const [isPlayingTimeline, setIsPlayingTimeline] = useState(false); // tells preview vid container the timeline vid  needs to show now (not currentlyCLicked mini-clip or latestClip) -- further down!!
	const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0); // knows which clip is being played currently, starts with clip nr.1 (0)

	//yet ANOTHER state for keeping track of muted/not muted timeline
	const [muted, setMuted] = useState(false);

	// ANOTHER STATE for keeping track of if mini clip is clicked then it should play
	const [playingMiniClip, setPlayingMiniClip] = useState<Clip | null>(null);

	// decides vid in preview: if you click mini clip that one shows up, if timeline is playing the current timeline clip shows. Nothing clicked/timeline not playing = latest added clip shows up
	const clipToPreview = isPlayingTimeline
		? timelineClips[
				Math.min(currentTimelineIndex, timelineClips.length - 1)
			]
		: (currentlyClicked ?? clips[clips.length - 1] ?? null);

	// using useVideoPlayer to play videos - clipToPreview ^ decides from where/which one
	const previewPlayer = useVideoPlayer(clipToPreview?.uri ?? '');

	// mute btn for timeline vid
	useEffect(() => {
		if (!previewPlayer) return;
		previewPlayer.volume = muted ? 0 : 1;
	}, [previewPlayer, muted]);

	const chooseImages = async () => {
		// FUNCTION FOR CHOOSING VIDS FROM PHONE GALLERY - & also clicking on the chosen vids to preview (play) them above
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
				id: (Date.now() + Math.random()).toString(), // id = time now in ms + (because several videos can be selected at the same ms) Math.random gives additional random number in the id
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
	const [thumbnails, setThumbnails] = useState<{ [id: string]: string }>({});

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

	const icons: { src: ImageSourcePropType; name: string }[] = [
		{ src: iconMute, name: 'Mute' },
		{ src: iconExport, name: 'Export' },
		{ src: iconMusic, name: 'Music' },
		{ src: iconDuration, name: 'Duration' },
	];

	// --------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------- PLAY TIMELINE CLIPS AS IF IT WAS 1 VIDEO -------------------------------------------
	// function to play the clips in the timeline

	useEffect(() => {
		if (!previewPlayer || !isPlayingTimeline) return; // returns if no useVideoPlayer exists  OR  if timeline is not playing

		const playToEndListener = previewPlayer.addListener('playToEnd', () => {
			setCurrentTimelineIndex((prev) => {
				if (prev < timelineClips.length - 1) {
					// checks if there are more clips in the [] to play - if not - ends the playback of clips
					return prev + 1; // more clips --> keeps playing clips
				} else {
					setIsPlayingTimeline(false); // no more clips --> stops the timeline playback (switches back to currently clicked mini clip or latest clip in preview)
					return 0; // stay on last clip
				}
			});
		});
		return () => playToEndListener.remove(); // removes the listener so it does not make any more players when the component is unmounted
	}, [timelineClips, previewPlayer, isPlayingTimeline]);

	// autoplay whenever new clip is starting in timeline (otherwise you need to manually press play btn every time for each new clip...)
	useEffect(() => {
		if (!previewPlayer) return;

		if (!isPlayingTimeline) {
			// only autoplay when timeline is active
			previewPlayer.pause();
			return; // automatically play whenever currentTimelineIndex changes
		}

		previewPlayer.play();

		const secondTimer = setTimeout(() => {
			setCurrentTimelineIndex((prev) => {
				if (prev < timelineClips.length - 1) {
					return prev + 1;
				} else {
					return 0;
				}
			});
		}, clipToPreview?.segmentLength * 1000); // prevents lag between clips
		return () => {
			clearTimeout(secondTimer);
		}; // clears the timer so it does not make any more timers when the component is unmounted
	}, [currentTimelineIndex, previewPlayer, isPlayingTimeline]);

	// --------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------- RENDER STUFF ON PAGE SECTION -------------------------------------------------------
	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu is pressed')}
			/>
			<ScrollView>
				<View style={styles.preview}>
					<LinearGradient
						style={styles.previewGradient}
						colors={['#ffc26d', '#fc8ed2']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}>
						{clipToPreview ? (
							<VideoView
								player={previewPlayer}
								style={styles.previewVideo}
								nativeControls={false}
							/>
						) : (
							<Text style={styles.previewText}>
								Add a video to preview down below! (+)
							</Text>
						)}
					</LinearGradient>
				</View>

				{/* MINI CLIP COLLECTION FROM GALLERY SECTION */}
				<ScrollView style={styles.scrollClips} horizontal={true}>
					<View style={styles.collection}>
						{clips.map((clip) => {
							return (
								<Pressable
									key={clip.id}
									onPress={() => {
										if (isPlayingTimeline)
											setIsPlayingTimeline(false);

										setCurrentlyClicked(clip);

										setPlayingMiniClip(clip);

										setTimelineClips((prev) => {
											if (
												prev.find(
													(c) => c.id === clip.id,
												)
											)
												return prev;
											return [...prev, clip];
										});

										if (previewPlayer) {
											previewPlayer.pause(); // reset playback
											previewPlayer.play();
										}
									}}>
									{thumbnails[clip.id] ? (
										<Image
											source={{
												uri: thumbnails[clip.id],
											}}
											style={styles.thumbnail}
										/>
									) : (
										<LinearGradient
											colors={['#ffc26d', '#fc8ed2']}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 0 }}
											style={{
												width: 60,
												height: 60,
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

				{/* TIMELINE SECTION - CLIPS ADDED FROM THE MINI CLIP COLLECTION */}
				<LinearGradient
					style={styles.timelineGradient}
					colors={['#ffc26d', '#fc8ed2']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}>
					<Pressable
						onPress={() => {
							if (timelineClips.length === 0) return;

							if (!isPlayingTimeline) {
								// if timeline is done playing clips, reset to index 0 so it can replay
								setCurrentTimelineIndex((prev) =>
									prev >= timelineClips.length ? 0 : prev,
								);
							}

							setIsPlayingTimeline((prev) => !prev);
						}}>
						<Image
							source={isPlayingTimeline ? pause : playBtn}
							style={styles.togglePlayBtn}
						/>
					</Pressable>
					<View style={styles.clipsWrapper}>
						<DraggableFlatList
							data={timelineClips}
							keyExtractor={(item) => item.id.toString()}
							horizontal
							renderItem={({ item, drag, isActive }) => (
								<View>
									<Pressable
										onLongPress={drag}
										style={styles.timelineClips}>
										<Image
											source={{
												uri: thumbnails[item.id],
											}}
											style={{
												width: 100,
												height: 100,
												opacity: isActive ? 0.7 : 1,
											}}
										/>
									</Pressable>
								</View>
							)}
							onDragEnd={({ data }) => setTimelineClips(data)}
						/>
					</View>
					{/* ICON SECTION */}
					<View style={styles.iconContainer}>
						{icons.map((icon, index) => (
							<Pressable
								key={icon.name}
								onPress={() => {
									if (icon.name === 'Mute') {
										setMuted((prev) => !prev); // toggle mute state
									} else {
										console.log(`${icon.name} pressed`);
									}
								}}>
								<Image
									source={icon.src}
									style={{
										width: 30,
										height: 30,
										margin: 10,
										opacity:
											icon.name === 'Mute' && muted
												? 0.5
												: 1,
									}}
								/>
							</Pressable>
						))}
					</View>
				</LinearGradient>
			</ScrollView>
		</>
	);
}

// --------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------- STYLES SECTION ---------------------------------------------------------------------

const styles = StyleSheet.create({
	preview: {
		width: '100%',
		height: 190,
		backgroundColor: 'pink',
	},
	previewVideo: {
		width: '100%',
		height: '100%',
	},
	previewGradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
	},
	previewText: {
		color: 'white',
		fontSize: 15,
	},
	collection: {
		flexDirection: 'row',
	},
	addVideo: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	addVideoBtn: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollClips: {
		height: 90,
	},
	togglePlayBtn: {
		width: 30,
		height: 30,
		margin: 10,
		alignSelf: 'center',
	},
	timelineGradient: {
		height: 180,
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	clipsWrapper: {
		height: 75,
	},
	timelineClips: {
		width: '100%',
		paddingTop: 10,
		paddingBottom: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	thumbnail: {
		width: 60,
		height: 60,
		borderRadius: 8,
		margin: 10,
	},
});
