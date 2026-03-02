import * as fc from 'fast-check';
import { flushSync } from 'svelte';
import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../../routes/+page.svelte';
import { appState } from '$lib/state.svelte.js';
import { md } from '$lib/types.js';
import { arbChat } from '../utils/arb.js';

describe('/+page.svelte', () => {
	it('renders the selector sidebar and chat area', async () => {
		render(Page);
		// Chat pane: active chat heading (h2 — first one in the DOM)
		await expect.element(page.getByRole('heading', { level: 2 }).first()).toBeInTheDocument();
		// Input area present
		await expect.element(page.getByRole('button', { name: 'Send' })).toBeInTheDocument();
	});

	describe('layout', () => {
		beforeEach(() => {
			appState.currentlySelected = 0;
			appState.chats[0].messages = [];
		});

		it('app is 50vw wide and 50vh tall', () => {
			render(Page);
			const app = document.querySelector('.app')!;
			const { width, height } = app.getBoundingClientRect();
			// getBoundingClientRect includes border, matching the border-box width/height
			expect(width).toBeCloseTo(window.innerWidth * 0.5, 0);
			expect(height).toBeCloseTo(window.innerHeight * 0.5, 0);
		});

		it('app is centered in the viewport', () => {
			render(Page);
			const app = document.querySelector('.app')!;
			const { left, right, top, bottom } = app.getBoundingClientRect();
			const centerX = (left + right) / 2;
			const centerY = (top + bottom) / 2;
			expect(Math.abs(centerX - window.innerWidth / 2)).toBeLessThanOrEqual(1);
			expect(Math.abs(centerY - window.innerHeight / 2)).toBeLessThanOrEqual(1);
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

		it('app stays within viewport when messages overflow', async () => {
			for (let i = 0; i < 30; i++) {
				appState.chats[0].messages.push({
					role: 'user',
					text: md(`Message ${i}`),
					time: new Date()
				});
			}
			render(Page);
			const app = document.querySelector('.app')!;
			// .chat ul — not .selector ul which comes first in the DOM
			const msgList = document.querySelector('.chat ul')!;
			// App must not grow a scrollbar — content scrolls inside, not outside
			expect(app.scrollHeight).toBe(app.clientHeight);
			// The message list itself is the scrollable container
			expect(msgList.scrollHeight).toBeGreaterThan(msgList.clientHeight);
		});

		it('auto-scrolls to the bottom when messages overflow', async () => {
			for (let i = 0; i < 30; i++) {
				appState.chats[0].messages.push({
					role: 'user',
					text: md(`Message ${i}`),
					time: new Date()
				});
			}
			render(Page);
			// Wait for the scroll $effect to fire and settle.
			// Both assertions needed: overflow proves the list is actually scrollable;
			// scrollTop proximity proves the scroll $effect ran correctly.
			await vi.waitFor(() => {
				const msgList = document.querySelector('.chat ul')!;
				expect(msgList.scrollHeight).toBeGreaterThan(msgList.clientHeight);
				expect(msgList.scrollHeight - msgList.scrollTop - msgList.clientHeight).toBeLessThan(16);
			});
		});

		it('auto-scrolls when a new message arrives and the user is already at the bottom', async () => {
			for (let i = 0; i < 30; i++) {
				appState.chats[0].messages.push({
					role: 'user',
					text: md(`Message ${i}`),
					time: new Date()
				});
			}
			render(Page);
			const msgList = document.querySelector('.chat ul')!;

			// Wait for initial auto-scroll
			await vi.waitFor(() => {
				expect(msgList.scrollHeight - msgList.scrollTop - msgList.clientHeight).toBeLessThan(16);
			});

			// New message arrives while the user is at the bottom
			flushSync(() => {
				appState.chats[0].messages = [
					...appState.chats[0].messages,
					{ role: 'partner', text: md('new'), time: new Date() }
				];
			});

			// View should have followed the new message down
			expect(msgList.scrollHeight - msgList.scrollTop - msgList.clientHeight).toBeLessThan(16);
		});

		it('selector stays within app when many chats exist', () => {
			// uniqueArray ensures no two chats share a name — Selector keys on chat.name
			appState.chats = fc.sample(
				fc.uniqueArray(arbChat(), { minLength: 20, maxLength: 20, selector: (c) => c.name }),
				1
			)[0];
			render(Page);
			const app = document.querySelector('.app')!;
			const sidebar = document.querySelector('.sidebar')!;
			// App must not grow — the sidebar scrolls inside
			expect(app.scrollHeight).toBe(app.clientHeight);
			// The sidebar itself is the scrollable container
			expect(sidebar.scrollHeight).toBeGreaterThan(sidebar.clientHeight);
		});

		it('does not auto-scroll when the user has scrolled away from the bottom', async () => {
			for (let i = 0; i < 30; i++) {
				appState.chats[0].messages.push({
					role: 'user',
					text: md(`Message ${i}`),
					time: new Date()
				});
			}
			render(Page);
			const msgList = document.querySelector('.chat ul')!;

			// Wait for the initial auto-scroll to settle
			await vi.waitFor(() => {
				expect(msgList.scrollHeight - msgList.scrollTop - msgList.clientHeight).toBeLessThan(16);
			});

			// User scrolls to the top — this disengages scroll-lock
			msgList.scrollTop = 0;
			msgList.dispatchEvent(new Event('scroll'));

			// flushSync forces Svelte's reactive updates to settle synchronously,
			// letting us assert DOM state immediately without a waitFor loop.
			const countBefore = msgList.querySelectorAll('li').length;
			flushSync(() => {
				appState.chats[0].messages = [
					...appState.chats[0].messages,
					{ role: 'partner', text: md('new'), time: new Date() }
				];
			});

			// New message was rendered — confirms the $effect ran
			expect(msgList.querySelectorAll('li').length).toBe(countBefore + 1);

			// Scroll position should remain near the top — lock must not have fired
			expect(msgList.scrollTop).toBeLessThan(16);
		});
	});
});
