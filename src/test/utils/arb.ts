/**
 * fast-check arbitraries for game types.
 *
 * We use fc.sample(arb, 1)[0] at call sites (single draw), not fc.assert().
 * Browser rendering tests are too slow for multi-run property checking; the
 * goal is data-independence, not exhaustive enumeration.
 *
 * arbMarkdown wraps fc.stringOf(fc.alpha()) — purely alphabetic strings that
 * contain no HTML special characters, making page.getByText() queries reliable.
 */
import * as fc from 'fast-check';
import {
	md,
	type ChatComponentState,
	type ChatUser,
	type ChatAppState,
	type GamePhase
} from '$lib/types.js';
import type { GameData } from '$lib/scenes/types.js';

export const arbGamePhase = (): fc.Arbitrary<GamePhase> =>
	fc.constantFrom('exploration', 'cutscene', 'postgame');

export const arbGameData = (): fc.Arbitrary<GameData> => fc.record({ phase: arbGamePhase() });

export const arbStatus = (): fc.Arbitrary<ChatUser['status']> =>
	fc.constantFrom('active', 'away', 'busy', 'offline');

// Clean alphabetic strings — safe for all DOM text queries
const arbText = (): fc.Arbitrary<string> => fc.stringMatching(/^[a-z]{3,16}$/);

export const arbMarkdown = () => arbText().map(md);

export const arbChatUser = (): fc.Arbitrary<ChatUser> =>
	fc.record({
		name: arbText(),
		profilePicture: fc.constant(''),
		status: arbStatus(),
		statusText: arbMarkdown()
	});

const arbMessage = () =>
	fc.record({
		role: fc.constantFrom('user' as const, 'partner' as const),
		text: arbMarkdown(),
		time: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') })
	});

/** Arbitrary ChatComponentState; minMessages controls the floor on messages[]. */
export const arbChat = (minMessages = 0): fc.Arbitrary<ChatComponentState> =>
	fc.record({
		name: arbText(),
		profilePicture: fc.constant(''),
		status: arbStatus(),
		statusText: arbMarkdown(),
		messages: fc.array(arbMessage(), { minLength: minMessages, maxLength: 6 })
	});

/** Chat whose final message is guaranteed to have role 'partner'. */
export const arbChatWithPartnerLastMessage = (): fc.Arbitrary<ChatComponentState> =>
	arbChat().chain((chat) =>
		fc
			.record({
				role: fc.constant('partner' as const),
				text: arbMarkdown(),
				time: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') })
			})
			.map((msg) => ({ ...chat, messages: [...chat.messages, msg] }))
	);

/**
 * Full ChatAppState with a valid currentlySelected index.
 * .chain() constrains currentlySelected to always be < chats.length.
 */
export const arbAppState = (minChats = 2): fc.Arbitrary<ChatAppState> =>
	fc
		.uniqueArray(arbChat(), { minLength: minChats, maxLength: 6, selector: (c) => c.name })
		.chain((chats) =>
			fc.record({
				chats: fc.constant(chats),
				player: arbChatUser(),
				currentlySelected: fc.integer({ min: 0, max: chats.length - 1 })
			})
		);
