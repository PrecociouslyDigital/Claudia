<script lang="ts">
	import Selector from '$lib/Selector.svelte';
	import Chat from '$lib/Chat.svelte';
	import Input from '$lib/Input.svelte';
</script>

<div class="app">
	<aside class="sidebar">
		<Selector />
	</aside>
	<main class="conversation">
		<Chat />
		<Input />
	</main>
</div>

<style>
	.app {
		display: flex;
		height: 100vh;
		border: 1px solid #ddd;
		box-sizing: border-box;
	}
	.sidebar {
		width: 260px;
		flex-shrink: 0;
	}
	.conversation {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	/* Chat scrollable area expands; Input stays anchored at the bottom */
	.conversation :global(.chat) {
		flex: 1;
		overflow-y: auto;
	}
</style>
