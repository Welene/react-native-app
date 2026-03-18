import { ImageSourcePropType } from 'react-native'; /*(for images, jpg, png)*/

// GLOBALLY SHARED TYPES

// ------------------ HEADER SECTION ---------------------
export type HeaderProps = {
	logo: ImageSourcePropType;

	onMenuPress: () => void;
};

export type ViewProps = {
	icon: ImageSourcePropType;

	onMenuPress: () => void;
};

/* hamburger menu items*/
export type MenuItem = {
	label: string;
	onPress: () => void;
};

export type addVideoBtn = {
	label: string;
	onPress?: () => void;
};

export type Clip = {
	id: number;
	uri: string;
	duration?: number;
	fileName?: string;
	startTime: number;
	segmentLength: number;
};

// export type HomepageProps = {
// 	nature: ImageSourcePropType;
// };
