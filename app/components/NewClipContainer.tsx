import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { StyleSheet } from 'react-native';

function NewClipContainer({ uri }: { uri: string }) {
	const videoPlayer = useVideoPlayer(uri);
	return <VideoView player={videoPlayer} style={styles.VideoView} />;
}

const styles = StyleSheet.create({
	VideoView: {
		borderRadius: 8,
	},
});

export default NewClipContainer;
