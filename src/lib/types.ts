export type Markdown = string & { readonly _brand: 'Markdown' };
/** Cast a raw string to Markdown — the only sanctioned entry point. */
export const md = (s: string): Markdown => s as Markdown;

export type Image = string;
export type UTCTime = Date;

export interface ChatUser {
	name: string;
	profilePicture: Image;
	status: 'active' | 'away' | 'busy' | 'offline';
	statusText: Markdown;
}

export type ChatComponentState = ChatUser & {
	messages: { role: 'user' | 'partner'; text: Markdown; time: UTCTime }[];
};

export type ChatAppState = {
	chats: ChatComponentState[];
	player: ChatUser;
	currentlySelected: number;
};

export type GamePhase = 'exploration' | 'cutscene' | 'postgame';
