<script lang="ts">
	import { appState } from '../state.svelte.js';
	import { md } from '../types.js';

	let text = $state('');

	function send() {
		const trimmed = text.trim();
		if (!trimmed) return;
		appState.chats[appState.currentlySelected].messages.push({
			role: 'user',
			text: md(trimmed),
			time: new Date()
		});
		text = '';
		// TODO: forward to Game State once that layer exists
	}
</script>

<!-- Stub: sends user messages into the active chat. Game State forwarding deferred. -->
<div class="input">
	<input
		bind:value={text}
		onkeydown={(e) => e.key === 'Enter' && send()}
		placeholder="Type a message…"
	/>
	<button onclick={send}>Send</button>
</div>
