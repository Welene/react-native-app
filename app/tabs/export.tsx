// THIRD TAB SECTION

import { StyleSheet, Text } from 'react-native';
import logo from '../assets/logo/min5.png';
import Header from '../components/Header';
import Celebration from '../components/Wohooo';

export default function TabThreeScreen() {
	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu pressed')}
			/>
			<Text style={styles.heading}> YAY! </Text>
			<Text style={styles.subHeading}> THE VIDEO IS DONE! </Text>
			<Celebration />
		</>
	);
}

const styles = StyleSheet.create({
	heading: {
		fontSize: 25,
		marginTop: 30,
		marginBottom: 15,
		textAlign: 'center',
		fontFamily: 'LibreBaskerville_400Regular',
		letterSpacing: 1.2,
	},
	subHeading: {
		fontSize: 20,
		textAlign: 'center',
		fontFamily: 'LibreBaskerville_400Regular',
		letterSpacing: 1.2,
	},
});
