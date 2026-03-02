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
        role: "user" | "partner";
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

```typescript
type GameState = { };

//Singleton state instance, mutated
export default const state : GameState;

export const incomingMessages: string[];

// Scenes are generally imported from specific scene files.
type Scene = () => undefined | Promise<Markdown>;
const sceneList : Scene[] = [];
var currentlyRunningScene : boolean = true;

function processMessageQueue(){
    if(currentlyRunningScene) return;
    currentlyRunningScene = true;
    while(R.notEmpty(incomingMessages)){
        const currentMessage = incomingMessages.shift();
        for(scene in sceneList){
            const mbRunner = scene();
            if(mbRunner != null) {
                Chat.appendPartnerMessage(assistantUser, await runner);
                break;
            }
        }
    }
    currentlyRunningScene = false;
}
```

Additionally, during development, buttons should be available to copy and paste state to and from the clipboard, and every change to the state should be logged, and the state should be able to be visually explored.

## Scene

Scenes generally live in their own modules, with the following pattern:

```typescript
// use a builder to prevent accidental state mutations
export const createSceneState = () => ({
    "..."
})

export const shouldTrigger: Scene = () => checkCondition ? runScene() : null;

async function runScene(){
    ///do the actual scene stuff
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
