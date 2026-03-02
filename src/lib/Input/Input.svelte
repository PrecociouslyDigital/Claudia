<script lang="ts">
	import { appState } from '../state.svelte.js';
	import { md } from '../types.js';
	import gameState from '../gameState.js';

	let text = $state('');

	function send() {
		const trimmed = text.trim();
		if (!trimmed) return;
		const userIndex = appState.currentlySelected;
		appState.chats[userIndex].messages.push({
			role: 'user',
			text: md(trimmed),
			time: new Date()
		});
		text = '';
		gameState.receiveMessage({ userIndex, text: md(trimmed) });
	}
</script>

<div class="input">
	<input
		bind:value={text}
		onkeydown={(e) => e.key === 'Enter' && send()}
		placeholder="Type a message…"
	/>
	<button onclick={send}>Send</button>
</div>
