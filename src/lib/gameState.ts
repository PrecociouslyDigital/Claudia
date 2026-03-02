import { appendPartnerMessage } from './state.svelte.js';
import { type Markdown } from './types.js';
import type { GameData, Scene } from './scenes/types.js';

/** Index of the companion (Claudia) in appState.chats. */
const COMPANION_INDEX = 0;

/** Strip common markdown markers so scenes receive plain text. */
const stripMarkdown = (text: string): string => text.replace(/[*_`#]/g, '');

export type GameState = {
	sceneList: Scene[];
	state: GameData;
	receiveMessage(msg: { userIndex: number; text: Markdown }): void;
	/** Resolves when the current queue run drains — await in tests to verify effects. */
	readonly processingDone: Promise<void>;
};

export function createGameState(
	appendMessage: (userIndex: number, text: Markdown) => void
): GameState {
	const queue: string[] = [];
	let data: GameData = { phase: 'exploration' };
	let currentlyRunning = false;
	let processingPromise: Promise<void> = Promise.resolve();

	async function processMessageQueue(): Promise<void> {
		if (currentlyRunning) return;
		currentlyRunning = true;
		while (queue.length > 0) {
			const text = queue.shift()!;
			for (const scene of instance.sceneList) {
				const [newData, mbResponse] = scene(data, text);
				data = newData;
				if (mbResponse !== undefined) {
					appendMessage(COMPANION_INDEX, await mbResponse);
					break;
				}
			}
		}
		currentlyRunning = false;
	}

	function receiveMessage(msg: { userIndex: number; text: Markdown }): void {
		if (msg.userIndex !== COMPANION_INDEX) return;
		queue.push(stripMarkdown(msg.text));
		if (!currentlyRunning) {
			processingPromise = processMessageQueue();
		}
	}

	const instance: GameState = {
		sceneList: [],
		get state() {
			return data;
		},
		receiveMessage,
		get processingDone() {
			return processingPromise;
		}
	};

	return instance;
}

/** Production singleton wired to the real appendPartnerMessage. */
export default createGameState(appendPartnerMessage);
