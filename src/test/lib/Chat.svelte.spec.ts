import * as fc from 'fast-check';
import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Chat from '$lib/chat/Chat.svelte';
import { appState } from '$lib/state.svelte.js';
import { md, type ChatComponentState } from '$lib/types.js';
import { arbChat, arbChatWithPartnerLastMessage } from '../utils/arb.js';

describe('Chat', () => {
	let chat: ChatComponentState;

	beforeEach(() => {
		chat = fc.sample(arbChat(), 1)[0];
		appState.currentlySelected = 0;
		appState.chats[0] = chat;
		// Zero out messages so header tests have a clean baseline
		appState.chats[0].messages = [];
	});

	describe('header', () => {
		it('shows the partner name as an h2', async () => {
			render(Chat);
			await expect
				.element(page.getByRole('heading', { name: chat.name, level: 2 }))
				.toBeInTheDocument();
		});

		it('shows the partner avatar', async () => {
			render(Chat);
			const headerImg = document.querySelector('header figure img');
			expect(headerImg).not.toBeNull();
		});

		it('shows a status dot', async () => {
			render(Chat);
			const dot = document.querySelector('header figure span');
			expect(dot).not.toBeNull();
		});

		it('status dot reflects the chat status via data-status', async () => {
			render(Chat);
			const dot = document.querySelector(`header figure span[data-status="${chat.status}"]`);
			expect(dot).not.toBeNull();
		});

		it('shows the status text', async () => {
			render(Chat);
			await expect.element(page.getByText(chat.statusText)).toBeInTheDocument();
		});
	});

	describe('empty state', () => {
		it('shows the empty message when there are no messages', async () => {
			render(Chat);
			const empty = document.querySelector('.empty');
			expect(empty).not.toBeNull();
		});

		it('does not render the message list when there are no messages', async () => {
			render(Chat);
			const ul = document.querySelector('ul');
			expect(ul).toBeNull();
		});
	});

	describe('messages', () => {
		beforeEach(() => {
			appState.chats[0].messages = [
				{ role: 'user', text: md('Hello there!'), time: new Date() },
				{ role: 'partner', text: md('Hi back!'), time: new Date() },
				{ role: 'user', text: md('How are you?'), time: new Date() }
			];
		});

		it('renders all message texts', async () => {
			render(Chat);
			await expect.element(page.getByText('Hello there!')).toBeInTheDocument();
			await expect.element(page.getByText('Hi back!')).toBeInTheDocument();
			await expect.element(page.getByText('How are you?')).toBeInTheDocument();
		});

		it('renders the correct number of partner bubbles', async () => {
			render(Chat);
			const partnerItems = document.querySelectorAll('li[data-role="partner"]');
			expect(partnerItems).toHaveLength(1);
		});

		it('renders the correct number of user bubbles', async () => {
			render(Chat);
			const userItems = document.querySelectorAll('li[data-role="user"]');
			expect(userItems).toHaveLength(2);
		});

		it('partner bubbles include the partner avatar', async () => {
			render(Chat);
			const partnerLi = document.querySelector('li[data-role="partner"]')!;
			expect(partnerLi.querySelector('img')).not.toBeNull();
		});

		it('user bubbles do not include an avatar', async () => {
			render(Chat);
			const userLis = document.querySelectorAll('li[data-role="user"]');
			for (const li of userLis) {
				expect(li.querySelector('img')).toBeNull();
			}
		});

		it('each bubble has a time element', async () => {
			render(Chat);
			const items = document.querySelectorAll('li');
			for (const li of items) {
				expect(li.querySelector('time')).not.toBeNull();
			}
		});
	});

	describe('chat switching', () => {
		it('updating currentlySelected shows the new partner name as h2', async () => {
			const secondChat = fc.sample(arbChat(1), 1)[0];
			appState.chats = [chat, secondChat];
			render(Chat);
			appState.currentlySelected = 1;
			await expect
				.element(page.getByRole('heading', { name: secondChat.name, level: 2 }))
				.toBeInTheDocument();
		});

		it('switching chats shows messages from the new chat', async () => {
			const secondChat = fc.sample(arbChatWithPartnerLastMessage(), 1)[0];
			appState.chats = [chat, secondChat];
			render(Chat);
			appState.currentlySelected = 1;
			const lastMsg = secondChat.messages.at(-1)!;
			await expect.element(page.getByText(lastMsg.text)).toBeInTheDocument();
		});
	});
});
