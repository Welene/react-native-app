// HELPERS - logic for handling adding new project to the user's project array

import { Project } from '@/lib/props';
import AsyncStorage from '@react-native-async-storage/async-storage';

// save project function that will save all data from tab 2 (AKA where you edit clips) - called on button press in projects.tsx (<pressable/>)
export const saveProject = async (project: Project) => {
	try {
		await AsyncStorage.setItem(
			`project-${project.id}`,
			JSON.stringify(project),
		);

		// UPDATE LSIT OF ALL PROJECT IDs
		const json = await AsyncStorage.getItem('projects-list');
		const list: string[] = json ? JSON.parse(json) : [];

		if (!list.includes(project.id)) list.push(project.id);
		await AsyncStorage.setItem('projects-list', JSON.stringify(list));
	} catch (error) {
		console.log('Error saving project:', error);
	}
};
// function that loads user's projects on homepage
export const loadProject = async (id: string): Promise<Project | null> => {
	try {
		const json = await AsyncStorage.getItem(`project-${id}`);
		return json ? JSON.parse(json) : null;
	} catch (error) {
		console.log('Could not fetch/load any projects', error);
		return null;
	}
};

// laod ALL projects by user
export const loadAllProjects = async (): Promise<Project[]> => {
	try {
		const json = await AsyncStorage.getItem('projects-list');
		const ids: string[] = json ? JSON.parse(json) : [];
		const projects = await Promise.all(ids.map((id) => loadProject(id)));
		return projects.filter((p): p is Project => p !== null);
	} catch (error) {
		console.log('Error loading all projects:', error);
		return [];
	}
};
