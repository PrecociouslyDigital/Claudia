import { md, type ChatAppState, type Markdown } from './types.js';

/** Singleton reactive state for the entire chat application. */
export const appState: ChatAppState = $state({
	player: {
		name: 'You',
		profilePicture: '',
		status: 'active',
		statusText: md('Online')
	},
	currentlySelected: 0,
	chats: [
		{
			name: 'Claudia',
			profilePicture: '',
			status: 'active',
			statusText: md('Always here for you ♡'),
			messages: []
		},
		{
			name: 'Jordan',
			profilePicture: '',
			status: 'offline',
			statusText: md('Be back soon'),
			messages: [
				{
					role: 'partner',
					text: md('sorry, heading to bed — catch you tomorrow!'),
					time: new Date()
				}
			]
		},
		{
			name: 'Sam',
			profilePicture: '',
			status: 'busy',
			statusText: md('In a meeting'),
			messages: [
				{
					role: 'partner',
					text: md('swamped rn, talk later?'),
					time: new Date()
				}
			]
		},
		{
			name: 'Riley',
			profilePicture: '',
			status: 'away',
			statusText: md('stepped out'),
			messages: [
				{
					role: 'partner',
					text: md("afk for a bit, don't wait up"),
					time: new Date()
				}
			]
		},
		{
			name: 'Alex',
			profilePicture: '',
			status: 'offline',
			statusText: md(''),
			messages: [
				{
					role: 'partner',
					text: md("can't hang tonight, sorry"),
					time: new Date()
				}
			]
		}
	]
});

/** Called by the Game State layer to deliver a partner message into a chat. */
export function appendPartnerMessage(userIndex: number, message: Markdown): void {
	appState.chats[userIndex].messages.push({
		role: 'partner',
		text: message,
		time: new Date()
	});
}
