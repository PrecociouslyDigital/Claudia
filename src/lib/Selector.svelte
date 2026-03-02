<script lang="ts">
	import { appState } from './state.svelte.js';

	/** Format a message time: HH:MM if today, else "Mon DD". */
	function formatTime(date: Date): string {
		const now = new Date();
		const sameDay =
			date.getFullYear() === now.getFullYear() &&
			date.getMonth() === now.getMonth() &&
			date.getDate() === now.getDate();
		if (sameDay) {
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
	}
</script>

<ul class="selector">
	{#each appState.chats as chat, i (chat.name)}
		{@const lastMsg = chat.messages.at(-1)}
		<li class="chat-row" class:selected={appState.currentlySelected === i}>
			<button class="chat-row-btn" onclick={() => (appState.currentlySelected = i)}>
				<div class="avatar-wrap">
					<img src={chat.profilePicture} alt={chat.name} class="avatar" />
					<span class="status-dot status--{chat.status}"></span>
				</div>
				<div class="chat-info">
					<span class="chat-name">{chat.name}</span>
					{#if lastMsg}
						<span class="chat-preview">{lastMsg.text}</span>
						<span class="chat-time">{formatTime(lastMsg.time)}</span>
					{:else}
						<span class="chat-preview empty">No messages yet</span>
					{/if}
				</div>
			</button>
		</li>
	{/each}
</ul>
