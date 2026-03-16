// This was for showing every single video added in a mini-clip
// I removed this component (and now use a static thumbnail directly inside the img-element)
// This is because it caused major lag on the phone, but I will keep it here for now I guess

// ----------------------------------------------------------------------------------------------------

// import { VideoView, useVideoPlayer } from 'expo-video';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';

// function NewClipContainer({ uri }: { uri: string }) {
// 	const videoPlayer = useVideoPlayer(uri);
// 	return (
// 		<View style={styles.clip}>
// 			<VideoView player={videoPlayer} style={styles.video} />
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	clip: {
// 		width: 100,
// 		height: 100,
// 		borderRadius: 8,
// 		overflow: 'hidden',
// 		margin: 10,
// 	},
// 	video: { width: '100%', height: '100%' },
// });

// export default NewClipContainer;
