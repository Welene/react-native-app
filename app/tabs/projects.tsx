// WELCOME TO: Helene thought it was a good idea to put the whole edit page in one file & divide it up later!! (so stupid.. :'--) )
// SECOND TAB SECTION <-- more like an edit page, but it has the name projects now.

// in case you're wondering:
// apparently expo-video is not able to play a smooth timeline clip without merging the video, which will break the delete & rearrange functions :---------)

import { loadProject, saveProject } from '@/lib/projects';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSearchParams } from 'expo-router/build/hooks';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useCallback, useEffect, useState } from 'react';
import {
	Alert,
	Image,
	ImageSourcePropType,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Clip } from '../../lib/props';
import iconDuration from '../assets/icons/duration.png';
import iconExport from '../assets/icons/export.png';
import iconMusic from '../assets/icons/music.png';
import iconMute from '../assets/icons/mute.png';
import pause from '../assets/icons/pause.png';
import playBtn from '../assets/icons/play.png';
import logo from '../assets/logo/min5.png';
import AddVideoBtn from '../components/AddVideoBtn';
import Header from '../components/Header';

// --------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------- THE-WHOLE-ASS-SCREEN SECTION -------------------------------------------------------
//
//
//
//
//
//
//

export default function TabTwoScreen() {
	// state of all clips, uses the Clip prop
	const [clips, setClips] = useState<Clip[]>([]);

	// state for title input - title saved in Projects (which is a state in projects.ts (shows projects --> home page)
	const [title, setTitle] = useState('');

	// prevents creating new projectId every time save btn is clicked
	const [currentProjectId, setCurrentProjectId] = useState<string | null>(
		null,
	);

	//state keeps track of: currently clicked mini clip, last added mini clip & if timeline clips are being played right now or not
	const [currentlyClicked, setCurrentlyClicked] = useState<Clip | null>(null); // remembers clicked clip --> shows up in previewVideo (overrides latestClip added!!)
	const [timelineClips, setTimelineClips] = useState<Clip[]>([]); // clips added to timeline array --> starts [empty]
	const [isPlayingTimeline, setIsPlayingTimeline] = useState(false); // tells preview vid container the timeline vid needs to show now (AKA NOT currentlyCLicked mini-clip / latestClip) -- further down!!
	const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0); // knows which clip is being played currently, starts with clip nr.1 (0)

	// avoid video stretching bug --> tracks if  clip is horizontal/vertical
	const [isVertical, setIsVertical] = useState<boolean | null>(null);

	// state for keeping track of muted/not muted timeline
	const [muted, setMuted] = useState(false);

	// ANOTHER STATE for keeping track of if mini clip is clicked then it should play
	const [playingMiniClip, setPlayingMiniClip] = useState<Clip | null>(null);

	// decides vid in preview:
	// click mini clip --> that one shows up..
	// if timeline is playing then the current timeline clip shows instead..
	// nothing clicked or timeline not playing --> latest added clip shows up
	const clipToPreview = isPlayingTimeline
		? timelineClips[
				Math.min(currentTimelineIndex, timelineClips.length - 1)
			]
		: (currentlyClicked ?? clips[clips.length - 1] ?? null);

	// using useVideoPlayer to play videos - clipToPreview ^ decides from where/which vid
	const previewPlayer = useVideoPlayer(clipToPreview?.uri ?? '');

	// mute btn for timeline vid
	useEffect(() => {
		if (!previewPlayer) return;
		previewPlayer.volume = muted ? 0 : 1;
	}, [previewPlayer, muted]);

	// pauses video when changing tab
	useFocusEffect(
		useCallback(() => {
			return () => {
				try {
					previewPlayer?.pause();
				} catch (error) {
					console.log('skipping pause');
				}
			};
		}, [previewPlayer]),
	);

	// CHOOSE VIDEOS FROM PHONE GALLERY SECTION
	const chooseImages = async () => {
		// also clicking on the chosen vids to preview (play) them above
		let result = await ImagePicker.launchImageLibraryAsync({
			// opens phone gallery where you  can choose img/vid
			mediaTypes: 'videos',
			allowsEditing: false,
			allowsMultipleSelection: true,
			quality: 1,
		});

		// video assets/metadata (clip objects)
		if (!result.canceled) {
			const newClips: Clip[] = result.assets.map((asset) => ({
				// telling prop to expect array of clips []
				id: (Date.now() + Math.random()).toString(), // id is time right now (but because several videos can be selected at the same time/ms --> Math.r gives extra id
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
			alert('Choose a video first');
		}
	};

	// for thumbnails in mini clip collection (added from gallery / under preview)
	const [thumbnails, setThumbnails] = useState<{ [id: string]: string }>({});

	// gets thumbnail from clips added
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

	// IMPORT ICONS (MUTE, EXPORT, MUSIC, DURATION) FOR THE TIMELINE SECTION
	const icons: { src: ImageSourcePropType; name: string }[] = [
		{ src: iconMute, name: 'Mute' },
		{ src: iconExport, name: 'Export' },
		{ src: iconMusic, name: 'Music' },
		{ src: iconDuration, name: 'Duration' },
	];

	// saving the project
	const handleSave = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const currentUser = user!;

		const id = currentProjectId ?? Date.now().toString(); // save btn creates new id if this project(id) has not been saved before - if there is one it updates

		await saveProject({
			id,
			title,
			clips,
			timelineClips,
			createdAt: new Date().toISOString(),
			userId: currentUser.id, // saves with current logged in user
		});
		setCurrentProjectId(id); // update currentprojectid state - prevents new id when save btn is clicked after 1st save (click)
		Alert.alert('Saved!', 'Your project has been saved successfully.');
	};

	//  "create new project +" --> reset edit page / new project
	const params = useSearchParams();
	const projectId = params.get('projectId'); // for loading existing project
	const newProjectFlag = params.get('newProject') === 'true'; // for starting fresh (reset)

	// then, only set previous project if NOT new project
	useEffect(() => {
		if (newProjectFlag) {
			// only reset if starting new project (btn)
			setClips([]);
			setTimelineClips([]);
			setTitle('');
			setCurrentlyClicked(null);
			setCurrentTimelineIndex(0);
			setIsPlayingTimeline(false);
			setMuted(false);
			setPlayingMiniClip(null);
			setCurrentProjectId(null); // RESET PROJECT BUG FIX
		} else if (projectId) {
			// load existing project instead of empty edit page
			(async () => {
				const project = await loadProject(projectId);
				if (project) {
					setTitle(project.title);
					setClips(project.clips);
					setTimelineClips(project.timelineClips ?? []);
					setCurrentlyClicked(
						project.clips[project.clips.length - 1] ?? null,
					);
					setCurrentProjectId(projectId); // RESET PROJECT BUG FIX
				}
			})();
		}
	}, [newProjectFlag, projectId]);

	// --------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------- PLAY TIMELINE CLIPS AS IF IT WAS 1 VIDEO -------------------------------------------
	// function to play the clips in the timeline
	//
	//
	//
	//
	//
	//
	//

	useEffect(() => {
		if (!previewPlayer || !isPlayingTimeline) return; // stops if no useVideoPlayer exists / timeline is not playing

		const playToEndListener = previewPlayer.addListener('playToEnd', () => {
			setCurrentTimelineIndex((prev) => {
				if (prev < timelineClips.length - 1) {
					// checks if there are more clips in the [] to play - if not - ends the playback of clips
					return prev + 1; // if more clips --> keeps playing
				} else {
					setIsPlayingTimeline(false); // no more clips --> stops the playback
					return 0; // stay on last clip
				}
			});
		});
		return () => playToEndListener.remove(); // stops listener when comp unmounts
	}, [timelineClips, previewPlayer, isPlayingTimeline]);

	// autoplay new clip in timeline (otherwise you need to manually press play btn for every clip)
	useEffect(() => {
		if (!previewPlayer) return;

		if (!isPlayingTimeline) {
			// only autoplay when timeline is active (PLAY mode)
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
		}, clipToPreview?.segmentLength * 1000); // prevents lag between clips... tried to anyway lol
		return () => {
			clearTimeout(secondTimer);
		}; // clears the timer --> does not make more timers on unmount
	}, [currentTimelineIndex, previewPlayer, isPlayingTimeline]);

	// gets data from video, is the vid a horizontalor vertical - fixes video stretching bug
	useEffect(() => {
		if (!clipToPreview) return;

		Image.getSize(
			clipToPreview.uri,
			(width, height) => {
				setIsVertical(height > width);
			},
			() => setIsVertical(null),
		);
	}, [clipToPreview]);

	// --------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------- RENDER STUFF ON PAGE SECTION -------------------------------------------------------
	//
	//
	//
	//
	//
	//
	//

	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu is pressed')}
			/>

			<ScrollView>
				<Text style={styles.heading}>PROJECT NAME</Text>
				<LinearGradient
					colors={['#ffc26d', '#fc8ed2']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.inputGradient}>
					<TextInput
						style={styles.input}
						value={title}
						onChangeText={setTitle}
					/>
					<Pressable style={styles.saveBtn} onPress={handleSave}>
						<Text style={styles.saveTxt}>Save</Text>
					</Pressable>
				</LinearGradient>

				{/* PREVIEW SECTION -------------------------------------*/}
				<View style={styles.previewWrapper}>
					{clipToPreview && isVertical !== null ? (
						<VideoView
							key={clipToPreview?.uri}
							player={previewPlayer}
							style={[
								styles.previewVideo,
								isVertical
									? styles.verticalVideo
									: styles.horizontalVideo,
							]}
							nativeControls={false}
						/>
					) : (
						<Text style={styles.previewText}>
							Add a video to preview down below! (+)
						</Text>
					)}
					<AddVideoBtn onPress={chooseImages} label="+" />
				</View>

				{/* MINI CLIP COLLECTION FROM GALLERY SECTION -----------------------------*/}
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
											<View // placeholder thumbnail - shows before thumbnail loads
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

				{/* TIMELINE SECTION - CLIPS ADDED FROM MINI CLIP COLLECTION -------------------------*/}
				<LinearGradient
					style={styles.timelineGradient}
					colors={['#ffc26d', '#fc8ed2']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}>
					<Pressable
						onPress={() => {
							if (timelineClips.length === 0) return;

							if (!isPlayingTimeline) {
								// if timeline is done playing, reset to index 0 --> replays
								setCurrentTimelineIndex((prev) =>
									prev >= timelineClips.length ? 0 : prev,
								);
							}

							setIsPlayingTimeline((prev) => !prev);
						}}>
						<Image
							source={isPlayingTimeline ? pause : playBtn} // toggle play icons
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
										onLongPress={drag} // drag to rearrange clips
										onPress={() =>
											setCurrentlyClicked(item)
										} // for deleting clips from timeline: if clip clicked + click trash icon = gone
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
							onDragEnd={({ data }) => setTimelineClips(data)} // updates state with new clip order
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
						<Pressable // using currentlyClicked to know which clip to delete!
							onPress={() => {
								if (!currentlyClicked) return; // nothing has been clicked
								setTimelineClips((prev) =>
									prev.filter(
										(clip) =>
											clip.id !== currentlyClicked.id,
									),
								);
								// reset currentlyClicked if it was deleted
								if (
									timelineClips.find(
										(c) => c.id === currentlyClicked.id,
									)
								)
									setCurrentlyClicked(null);
							}}>
							<Image
								source={require('../assets/icons/trash.png')}
								style={{ width: 30, height: 30, margin: 10 }}
							/>
						</Pressable>
					</View>
				</LinearGradient>
			</ScrollView>
		</>
	);
}

// --------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------- STYLES SECTION ---------------------------------------------------------------------
//
//
//
//
//
//
//

const styles = StyleSheet.create({
	heading: {
		fontSize: 25,
		marginTop: 30,
		marginBottom: 35,
		textAlign: 'center',
		fontFamily: 'LibreBaskerville_400Regular',
		letterSpacing: 1.2,
	},
	input: {
		borderWidth: 2,
		borderColor: 'white',
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		backgroundColor: '#fcfcfc',
		fontSize: 16,
		left: 15,
		marginRight: 10,
		flex: 1,
		// iOS - I can't see :--)
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		// Android - I can see!
		elevation: 10,
	},
	saveBtn: {
		backgroundColor: 'pink',
		paddingBottom: 14,
		paddingTop: 14,
		width: 55,
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		marginRight: 15,
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
		borderTopRightRadius: 8,
		borderBottomRightRadius: 8,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
	},
	saveTxt: {
		color: 'white',
		fontWeight: 'bold',
	},
	inputGradient: {
		height: 90,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
	},

	previewWrapper: {
		width: '100%',
		height: 190,
		backgroundColor: '#f1f1f1',
		position: 'relative',
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
	},
	previewVideo: {
		position: 'absolute',
	},

	horizontalVideo: {
		width: '100%',
		height: '100%',
	},

	verticalVideo: {
		height: '100%',
		width: undefined,
		aspectRatio: 9 / 16,
	},
	previewText: {
		color: 'grey',
		fontStyle: 'italic',
		letterSpacing: 1.2,
		fontSize: 15,
	},
	collection: {
		flexDirection: 'row',
	},

	scrollClips: {
		height: 90,
		marginBottom: 30,
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
	shadowBox: {
		// to put on dynamic elements
		// iOS
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		// Android
		elevation: 10,
	},
});
