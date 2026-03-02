# Technical Design Document

There are two principal systems in play: the chat application, and the game state. The two pass well-defined messages to tightly-bound interfaces in a "mailbox" model.

## Application Layer

This layer comprises the basic Create and Read actions the user can perform in the chat application. It involves three main sections: A chat selector on the left side, an active chat on the right, which comprises a chat component and an input component. Because of the limited nature of this experience, this system should be as simple and involve as little abstraction as possible. It should provide the following interface to the Game State.

```typescript
interface ChatUser = {
    name: string;
    profilePicture: Image;
    status: "active" | "away" | "busy" | "offline";
    statusText: Markdown;
}
type ChatAppState = {
    chats: ChatComponentState[];
    player : ChatUser;
    // 0-index of currently selected chat
    currentlySelected : number;
}
// Game layer tightly binds to this to send messages as the "partners"
function appendPartnerMessage (userIndex: number; message: Markdown) : void;
```

### Chat component

Each "chat" should be an instance of a component, which is a data-dependent renderer of a list of chat objects. It should, provided a list of these objects, render the chat, including timestamps, and profile pictures/usernames in between changes in the chat.

```typescript
type ChatComponentState = ChatUser & {
	messsages: {
		role: 'user' | 'partner';
		text: Markdown;
		time: UTCTime;
	}[];
};
```

### Selector component

There should be one selector component, which is responsible for tracking the currently selected chat. It should list all available chats, the last message sent in each of them, as well as the username, profile picture, status indicator, and other expected information about the chat. The currently selected chat should also be highlighted the active chat, and clicking on another chat should select that chat.

### Input Component

The input component is omnipresent, and involves an input field in which the user can compose their message. Once the user sends the message, the Input Component should both update the currently selected chat component with the user's new message, _and_ forward the message and currently selected partner to the Game State (see below).

## Game State

The Game State comprises the logic of the game. It exposes the following interface to the Application Layer:

```typescript
function recieveMessage(message: { userIndex: number; text: Markdown }): void {
	// Never respond unless it's the assistant user.
	if (userIndex !== assistantUser) return;
	GameState.incomingMessages.push(stripMarkdown(message.text));
	// Kick off the message processing loop. notably DOES NOT AWAIT; we don't want to block recieving more user messages.
	GameState.processMessageQueue();
}
```

The game state is structured as a factory for testability — `appendPartnerMessage` is injected rather than imported directly, allowing tests to supply a mock.

```typescript
/** Pure game data — no methods. Flows through scenes like redux state. */
type GameData = {
	phase: GamePhase;
	// extended by scenes as needed
};

type GameState = {
	sceneList: Scene[];
	data: GameData;
	receiveMessage(msg: { userIndex: number; text: Markdown }): void;
	processingDone: Promise<void>; // resolves when queue drains; useful in tests
};

// Factory — production code wires in the real appendPartnerMessage
function createGameState(
	appendMessage: (userIndex: number, text: Markdown) => void,
	initialData: GameData = { phase: 'exploration' }
): GameState;

// Singleton used by the application layer
export const gameState: GameState;

const incomingMessages: string[];
let currentlyRunning: boolean = false;

async function processMessageQueue() {
	if (currentlyRunning) return;
	currentlyRunning = true;
	while (incomingMessages.length > 0) {
		const text = incomingMessages.shift()!;
		for (const scene of sceneList) {
			const [newData, mbResponse] = scene(data, text);
			data = newData; // always update state, even for non-matching scenes
			if (mbResponse !== undefined) {
				appendMessage(assistantUser, await mbResponse);
				break;
			}
		}
	}
	currentlyRunning = false;
}
```

Additionally, during development, buttons should be available to copy and paste state to and from the clipboard, and every change to the state should be logged, and the state should be able to be visually explored.

## Scene

Scenes are pure functions following a redux-style pattern — they receive the current `GameData` and the stripped message text, and return the (possibly updated) `GameData` plus an optional async response. The first scene that returns a non-`undefined` response handles the message; all scenes always have the opportunity to update state.

```typescript
/** Pure game data flowing through the scene pipeline. */
export type GameData = {
	phase: GamePhase;
};

/**
 * A scene is a pure function:
 *   - Always returns [newState, response | undefined]
 *   - If response is defined, this scene is "handling" the message
 *   - May update GameData even when not handling (e.g. tracking counters)
 */
export type Scene = (state: GameData, message: string) => [GameData, Promise<Markdown> | undefined];

// Typical scene module pattern:
export function myScene(state: GameData, message: string): ReturnType<Scene> {
	if (!shouldHandle(message)) return [state, undefined];
	return [state, Promise.resolve(md(generateResponse(message)))];
}
```

## Synonym System

The Synonym System is a system that helps Scenes in the Game Layer avoid repetitive, stilted content. It exposes the following interface:

```typescript
type SynonymCorpus = {
    [key: string]: Synonym<any>;
};

type Synonym<Sources> = {
    synonyms: [(Sources) => string];
    currentIndex: number;
};

type Synonym<undefined> = {
    synonyms: [string];
    currentIndex: number;
};
type GetInnerType<S> = S extends SomeInterface<infer T> ? T : never

function getSynonym<K keyof SynonymCorpus>, (key: K, sources: GetInnerType<Synonym[K]>, peek: boolean = false): string;
```

When a specific key is provided to the synonym system, it returns the next unreturned synonym. If no synonyms are left, it shuffles the list of synonyms, resets the currentIndex to 0 to mark the entire list as unreturned, then returns the next unreturned synonym.
