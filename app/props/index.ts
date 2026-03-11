import { ImageSourcePropType } from 'react-native'; /*(for images, jpg, png)*/

// GLOBALLY SHARED TYPES

// ------------------ HEADER SECTION ---------------------
export type HeaderProps = {
	logo: ImageSourcePropType;

	onMenuPress: () => void;
};

/* hamburger menu items*/
export type MenuItem = {
	label: string;
	onPress: () => void;
};

// export type HomepageProps = {
// 	nature: ImageSourcePropType;
// };
