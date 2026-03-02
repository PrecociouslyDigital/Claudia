import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';
import { appState } from '$lib/state.svelte.js';
import { md } from '$lib/types.js';

describe('/+page.svelte', () => {
	it('renders the selector sidebar and chat area', async () => {
		render(Page);
		// Chat pane: active chat heading (h2 with the selected partner's name)
		await expect
			.element(page.getByRole('heading', { name: 'Claudia', level: 2 }))
			.toBeInTheDocument();
		// Input area present
		await expect.element(page.getByRole('button', { name: 'Send' })).toBeInTheDocument();
	});

	describe('layout', () => {
		beforeEach(() => {
			appState.currentlySelected = 0;
			appState.chats[0].messages = [];
		});

		it('input is pinned to the bottom of the app container', () => {
			render(Page);
			const app = document.querySelector('.app')!;
			const input = document.querySelector('.input')!;
			const { bottom: appBottom } = app.getBoundingClientRect();
			const { bottom: inputBottom } = input.getBoundingClientRect();
			// Allow 1px for sub-pixel rounding
			expect(Math.abs(appBottom - inputBottom)).toBeLessThanOrEqual(1);
		});

		it('app stays within viewport height when messages overflow', async () => {
			for (let i = 0; i < 30; i++) {
				appState.chats[0].messages.push({
					role: 'user',
					text: md(`Message ${i}`),
					time: new Date()
				});
			}
			render(Page);
			const app = document.querySelector('.app')!;
			const chat = document.querySelector('.chat')!;
			// App must not grow a scrollbar — content scrolls inside, not outside
			expect(app.scrollHeight).toBe(app.clientHeight);
			// The chat pane clips overflow and becomes scrollable
			expect(chat.scrollHeight).toBeGreaterThan(chat.clientHeight);
		});
	});
});
