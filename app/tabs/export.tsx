// THIRD TAB SECTION

import { Text, View } from 'react-native';
import logo from '../assets/logo/min5.png';
import Header from '../components/Header';

export default function TabThreeScreen() {
	return (
		<>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu pressed')}
			/>
			<View>
				<Text>THIS PAGE IS CURRENTLY UNDER CONSTRUCTION</Text>
			</View>
		</>
	);
}
