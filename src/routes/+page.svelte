<script lang="ts">
	import Selector from '$lib/selector/Selector.svelte';
	import Chat from '$lib/chat/Chat.svelte';
	import Input from '$lib/input/Input.svelte';
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
		width: 50vw;
		height: 50vh;
		/* Center in viewport regardless of body margin */
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid #ddd;
		box-sizing: border-box;
	}
	.sidebar {
		width: 30%;
		min-width: 160px;
		max-width: 260px;
		flex-shrink: 0;
		overflow-y: auto;
	}
	.conversation {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	/* Chat declares flex:1/min-height:0 itself; this just confirms the intent from outside */
	.conversation :global(.chat) {
		flex: 1;
	}
</style>
