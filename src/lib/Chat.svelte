<script lang="ts">
	import { appState } from './state.svelte.js';

	// Derive the active chat from singleton state — no props needed
	const chat = $derived(appState.chats[appState.currentlySelected]);
</script>

<!-- Stub: renders the active chat's name. Full message list comes in a later iteration. -->
<section class="chat">
	<h2>{chat.name}</h2>
</section>
