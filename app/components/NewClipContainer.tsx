import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { StyleSheet } from 'react-native';

function NewClipContainer({ uri }: { uri: string }) {
	const videoPlayer = useVideoPlayer(uri);
	return <VideoView player={videoPlayer} style={styles.videoView} />;
}

const styles = StyleSheet.create({
	videoView: {
		height: 120,
		margin: 10,
	},
});

export default NewClipContainer;
