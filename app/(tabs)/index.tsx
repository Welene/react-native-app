// FIRST TAB SECTION
import { Text, View } from 'react-native';
import logo from '../assets/logo/min1.png';
import Header from '../components/Header';

export default function HomeScreen() {
	return (
		<View style={{ flex: 1 }}>
			<Header
				logo={logo}
				onMenuPress={() => console.log('menu is pressed')}
			/>
			<View>
				<Text>THIS IS THE FIRST PAGE/TAB!</Text>
			</View>
		</View>
	);
}

// const styles = StyleSheet.create({
// 	titleContainer: {
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		gap: 8,
// 	},
// 	stepContainer: {
// 		gap: 8,
// 		marginBottom: 8,
// 	},
// 	reactLogo: {
// 		height: 178,
// 		width: 290,
// 		bottom: 0,
// 		left: 0,
// 		position: 'absolute',
// 	},
// });
