// SECOND TAB SECTION

import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, Text, View } from 'react-native';
import logo from '../assets/logo/min5.png';
import AddVideoBtn from '../components/AddVideoBtn';
import Header from '../components/Header';

export default function TabTwoScreen() {
	const chooseImages = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'videos',
			allowsEditing: false,
			quality: 1,
		});

		if (!result.canceled) {
			console.log(result);
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
				{/* STOR PREVIEW VIDEO BOKS - SPILLER AV VIDEOER MAN HAR LAGT TIL OM MAN TRYKKER PÅ PLAY */}
			</View>
			<View style={styles.collection}>
				{/* DYNAMISKE VIEWS HER MED MINI VIDEOER MAN HAR VALGT */}
			</View>
			<View style={styles.addVideo}>
				<Text> TAB TWO</Text>
				<AddVideoBtn label="Add video" onPress={chooseImages} />
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	preview: {
		width: '90%',
		height: 80,
	},
	collection: {
		width: '20%',
		height: 10,
	},
	addVideo: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
});
