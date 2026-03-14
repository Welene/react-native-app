import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { StyleSheet, View } from 'react-native';
function NewClipContainer({ uri }: { uri: string }) {
	const videoPlayer = useVideoPlayer(uri);
	return (
		<View style={styles.clip}>
			<VideoView player={videoPlayer} style={styles.video} />
		</View>
	);
}

const styles = StyleSheet.create({
	clip: {
		width: 100,
		height: 100,
		borderRadius: 8,
		overflow: 'hidden',
		margin: 10,
	},
	video: { width: '100%', height: '100%' },
});

export default NewClipContainer;
