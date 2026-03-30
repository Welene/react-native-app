// *click* WOHOO! *POP* fschhhh ~~~

import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function Celebration() {
	const [popId, setPopId] = useState<number | null>(null);

	const handlePress = () => {
		setPopId(Date.now());
	};

	return (
		<View
			style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
			<Pressable
				onPress={handlePress}
				style={{
					backgroundColor: 'pink',
					padding: 12,
					borderRadius: 8,
					marginBottom: 20,
					shadowColor: '#000',
					elevation: 4,
				}}>
				<Text
					style={{
						color: 'white',
						fontWeight: 'bold',
						letterSpacing: 1.2,
					}}>
					Celebrate!
				</Text>
			</Pressable>

			{popId && (
				<ConfettiCannon
					key={popId}
					count={25}
					origin={{ x: 200, y: 200 }}
					fadeOut={true}
					autoStart={true}
					explosionSpeed={350}
				/>
			)}
		</View>
	);
}
