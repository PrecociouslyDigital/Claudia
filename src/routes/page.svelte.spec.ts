import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

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
		it('input is flush with the bottom of the conversation pane', () => {
			render(Page);
			const conversation = document.querySelector('.conversation')!;
			const input = document.querySelector('.input')!;
			const { bottom: convBottom } = conversation.getBoundingClientRect();
			const { bottom: inputBottom } = input.getBoundingClientRect();
			// Allow 1px for sub-pixel rounding
			expect(Math.abs(convBottom - inputBottom)).toBeLessThanOrEqual(1);
		});
	});
});
