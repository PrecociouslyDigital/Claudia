import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Selector from './Selector.svelte';
import { appState } from './state.svelte.js';

describe('Selector', () => {
	beforeEach(() => {
		appState.currentlySelected = 0;
	});

	it('renders all chat names', async () => {
		render(Selector);
		for (const chat of appState.chats) {
			await expect.element(page.getByText(chat.name)).toBeInTheDocument();
		}
	});

	it('each row has a status-dot element', async () => {
		render(Selector);
		// Direct DOM query — `document` is the live browser document in browser mode
		const dots = document.querySelectorAll('.status-dot');
		expect(dots).toHaveLength(appState.chats.length);
	});

	it('first chat row has class selected by default', async () => {
		render(Selector);
		const firstRow = document.querySelector('.chat-row');
		expect(firstRow?.classList.contains('selected')).toBe(true);
	});

	it('clicking a chat sets appState.currentlySelected', async () => {
		render(Selector);
		// Chat rows have role="button"; .nth() navigates to the 3rd
		await page.getByRole('button').nth(2).click();
		expect(appState.currentlySelected).toBe(2);
	});

	it('selected class moves to the clicked row', async () => {
		render(Selector);
		await page.getByRole('button').nth(1).click();
		const rows = document.querySelectorAll('.chat-row');
		expect(rows[0]?.classList.contains('selected')).toBe(false);
		expect(rows[1]?.classList.contains('selected')).toBe(true);
	});

	it('last message preview text appears for chats with messages', async () => {
		render(Selector);
		// Jordan (index 1) has a seed message
		const lastMsg = appState.chats[1].messages.at(-1)!;
		await expect.element(page.getByText(lastMsg.text)).toBeInTheDocument();
	});

	it('.chat-preview.empty appears for chats without messages', async () => {
		render(Selector);
		// Claudia (index 0) starts with no messages
		const emptyPreview = document.querySelector('.chat-preview.empty');
		expect(emptyPreview).not.toBeNull();
	});
});
