import type { Markdown, GamePhase } from '$lib/types.js';

/** Pure game data — no methods. Flows through scenes like redux state. */
export type GameData = {
	phase: GamePhase;
};

/**
 * A scene is a pure function that receives the current game data and the
 * stripped message text. It always returns the (possibly updated) data.
 * If the second element is defined, this scene is "handling" the message
 * and the dispatch loop stops after it. Non-handling scenes may still
 * update GameData (e.g. to track counters or advance phase).
 */
export type Scene = (state: GameData, message: string) => [GameData, Promise<Markdown> | undefined];
