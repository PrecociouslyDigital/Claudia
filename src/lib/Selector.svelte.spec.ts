import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Selector from './selector/Selector.svelte';
import { appState } from './state.svelte.js';
import { md } from './types.js';

describe('Selector', () => {
	beforeEach(() => {
		appState.currentlySelected = 0;
		appState.chats[0].messages = [];
	});

	it('renders all chat names', async () => {
		render(Selector);
		for (const chat of appState.chats) {
			await expect.element(page.getByText(chat.name)).toBeInTheDocument();
		}
	});

	it('each row has a status indicator', async () => {
		render(Selector);
		const dots = document.querySelectorAll('[data-status]');
		expect(dots).toHaveLength(appState.chats.length);
	});

	it('first chat row has aria-current by default', async () => {
		render(Selector);
		const firstRow = document.querySelector('li');
		expect(firstRow?.getAttribute('aria-current')).toBe('true');
	});

	it('clicking a chat sets appState.currentlySelected', async () => {
		render(Selector);
		// Chat rows have role="button"; .nth() navigates to the 3rd
		await page.getByRole('button').nth(2).click();
		expect(appState.currentlySelected).toBe(2);
	});

	it('aria-current moves to the clicked row', async () => {
		render(Selector);
		await page.getByRole('button').nth(1).click();
		const rows = document.querySelectorAll('li');
		expect(rows[0]?.getAttribute('aria-current')).toBeNull();
		expect(rows[1]?.getAttribute('aria-current')).toBe('true');
	});

	it('partner last message preview shows text without prefix', async () => {
		render(Selector);
		// Jordan (index 1) has a seed partner message
		const lastMsg = appState.chats[1].messages.at(-1)!;
		await expect.element(page.getByText(lastMsg.text)).toBeInTheDocument();
	});

	it('user last message preview is prefixed with "You:"', async () => {
		appState.chats[0].messages = [{ role: 'user', text: md('Hey!'), time: new Date() }];
		render(Selector);
		await expect.element(page.getByText('You: Hey!')).toBeInTheDocument();
	});

	it('empty preview appears for chats without messages', async () => {
		render(Selector);
		// Claudia (index 0) starts with no messages
		const emptyPreview = document.querySelector('small.empty');
		expect(emptyPreview).not.toBeNull();
	});

	describe('layout', () => {
		it('list has no bullet styling', () => {
			render(Selector);
			const ul = document.querySelector('.selector')!;
			expect(getComputedStyle(ul).listStyleType).toBe('none');
		});

		it('all chat rows are the same height', () => {
			render(Selector);
			const buttons = [...document.querySelectorAll('li > button')] as HTMLElement[];
			const heights = buttons.map((b) => b.offsetHeight);
			// Every row should render at exactly the same height
			expect(new Set(heights).size).toBe(1);
		});
	});
});
