/**
 * Unit tests for the game state layer.
 *
 * createGameState() is a factory that injects appendPartnerMessage — each test
 * gets a fresh instance with a vi.fn() mock, so no vi.mock() or module resets needed.
 */
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import gameState, { createGameState } from '$lib/gameState.js';
import type { Scene, GameData } from '$lib/scenes/types.js';
import { md, type GamePhase, type Markdown } from '$lib/types.js';

describe('gameState', () => {
	let mockAppend: Mock<(userIndex: number, text: Markdown) => void>;
	let gs: ReturnType<typeof createGameState>;

	beforeEach(() => {
		mockAppend = vi.fn<(userIndex: number, text: Markdown) => void>();
		gs = createGameState(mockAppend);
	});

	it('initial phase is exploration', () => {
		expect(gs.state.phase).toBe('exploration');
	});

	describe('receiveMessage routing', () => {
		it('ignores messages not addressed to the companion (userIndex !== 0)', async () => {
			const handleAll: Scene = (s) => [s, Promise.resolve(md('response'))];
			gs.sceneList.push(handleAll);
			gs.receiveMessage({ userIndex: 1, text: md('hello') });
			await gs.processingDone;
			expect(mockAppend).not.toHaveBeenCalled();
		});

		it('processes messages addressed to the companion (userIndex === 0)', async () => {
			const handleAll: Scene = (s) => [s, Promise.resolve(md('response'))];
			gs.sceneList.push(handleAll);
			gs.receiveMessage({ userIndex: 0, text: md('hello') });
			await gs.processingDone;
			expect(mockAppend).toHaveBeenCalledOnce();
		});
	});

	describe('scene dispatch', () => {
		it('calls appendMessage with companion index 0 and the scene response', async () => {
			const scene: Scene = (s) => [s, Promise.resolve(md('reply'))];
			gs.sceneList.push(scene);
			gs.receiveMessage({ userIndex: 0, text: md('hi') });
			await gs.processingDone;
			expect(mockAppend).toHaveBeenCalledWith(0, md('reply'));
		});

		it('skips non-matching scenes and uses the first matching one', async () => {
			const noMatch: Scene = (s) => [s, undefined];
			const match: Scene = (s) => [s, Promise.resolve(md('found'))];
			gs.sceneList.push(noMatch, match);
			gs.receiveMessage({ userIndex: 0, text: md('hi') });
			await gs.processingDone;
			expect(mockAppend).toHaveBeenCalledWith(0, md('found'));
		});

		it('stops after the first matching scene', async () => {
			const second = vi.fn(
				(s: GameData) => [s, Promise.resolve(md('second'))] as ReturnType<Scene>
			);
			const first: Scene = (s) => [s, Promise.resolve(md('first'))];
			gs.sceneList.push(first, second);
			gs.receiveMessage({ userIndex: 0, text: md('hi') });
			await gs.processingDone;
			expect(second).not.toHaveBeenCalled();
		});

		it('sends no reply when no scene matches', async () => {
			const noMatch: Scene = (s) => [s, undefined];
			gs.sceneList.push(noMatch);
			gs.receiveMessage({ userIndex: 0, text: md('hi') });
			await gs.processingDone;
			expect(mockAppend).not.toHaveBeenCalled();
		});
	});

	describe('state threading', () => {
		it('state updates from non-handling scenes are visible to later scenes', async () => {
			let seenPhase: GamePhase | undefined;
			// advance updates phase but does not handle the message
			const advance: Scene = (state) => [{ ...state, phase: 'cutscene' }, undefined];
			const capture: Scene = (state) => {
				seenPhase = state.phase;
				return [state, Promise.resolve(md('ok'))];
			};
			gs.sceneList.push(advance, capture);
			gs.receiveMessage({ userIndex: 0, text: md('test') });
			await gs.processingDone;
			expect(seenPhase).toBe('cutscene');
		});

		it('state changes persist across messages', async () => {
			// First message: advance phase to cutscene
			const advance: Scene = (state) => [
				{ ...state, phase: 'cutscene' },
				Promise.resolve(md('ok'))
			];
			gs.sceneList.push(advance);
			gs.receiveMessage({ userIndex: 0, text: md('first') });
			await gs.processingDone;

			// Second message: observe the phase
			let observedPhase: GamePhase | undefined;
			gs.sceneList.length = 0;
			gs.sceneList.push((state) => {
				observedPhase = state.phase;
				return [state, Promise.resolve(md('ok'))];
			});
			gs.receiveMessage({ userIndex: 0, text: md('second') });
			await gs.processingDone;

			expect(observedPhase).toBe('cutscene');
		});

		it('returned GameData becomes the new gs.state', async () => {
			const advance: Scene = (state) => [
				{ ...state, phase: 'cutscene' },
				Promise.resolve(md('ok'))
			];
			gs.sceneList.push(advance);
			gs.receiveMessage({ userIndex: 0, text: md('test') });
			await gs.processingDone;
			expect(gs.state.phase).toBe('cutscene');
		});
	});

	describe('message queue', () => {
		it('processes multiple messages in FIFO order', async () => {
			const received: string[] = [];
			const capture: Scene = (s, msg) => {
				received.push(msg);
				return [s, Promise.resolve(md('ok'))];
			};
			gs.sceneList.push(capture);
			gs.receiveMessage({ userIndex: 0, text: md('first') });
			gs.receiveMessage({ userIndex: 0, text: md('second') });
			gs.receiveMessage({ userIndex: 0, text: md('third') });
			await gs.processingDone;
			expect(received).toEqual(['first', 'second', 'third']);
		});

		it('processingDone resolves only after all queued messages complete', async () => {
			let count = 0;
			const counter: Scene = (s) => {
				count++;
				return [s, Promise.resolve(md('ok'))];
			};
			gs.sceneList.push(counter);
			gs.receiveMessage({ userIndex: 0, text: md('a') });
			gs.receiveMessage({ userIndex: 0, text: md('b') });
			gs.receiveMessage({ userIndex: 0, text: md('c') });
			await gs.processingDone;
			expect(count).toBe(3);
		});
	});

	describe('markdown stripping', () => {
		it('strips basic markdown markers before passing text to scenes', async () => {
			let received = '';
			const capture: Scene = (s, msg) => {
				received = msg;
				return [s, Promise.resolve(md('ok'))];
			};
			gs.sceneList.push(capture);
			gs.receiveMessage({ userIndex: 0, text: md('**hello**') });
			await gs.processingDone;
			expect(received).toBe('hello');
		});
	});

	// Canary for scene purity: each scene in the production list must not mutate the
	// GameData object it receives — state updates must flow through the return value.
	// Trivially passes until real scenes are registered; will catch violations immediately.
	describe('scene purity', () => {
		it('no scene in the real sceneList mutates its input state', () => {
			// Baseline assertion so the test isn't vacuously empty when no scenes exist yet
			expect(gameState.sceneList).toBeDefined();
			const input: GameData = { phase: 'exploration' };
			for (const scene of gameState.sceneList) {
				scene(input, 'test message');
				expect(input).toEqual({ phase: 'exploration' });
			}
		});
	});
});
