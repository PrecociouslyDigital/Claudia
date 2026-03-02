<script lang="ts">
	import { appState } from './state.svelte.js';
	import { formatTime } from './time.js';
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

<style>
	.selector {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.chat-row-btn {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 8px;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
	}
	.avatar-wrap {
		position: relative;
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		margin-right: 8px;
	}
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		background: #ccc;
	}
	.status-dot {
		position: absolute;
		bottom: 1px;
		right: 1px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid white;
	}
	.status--active {
		background: #4caf50;
	}
	.status--away {
		background: #ff9800;
	}
	.status--busy {
		background: #f44336;
	}
	.status--offline {
		background: #9e9e9e;
	}
	.chat-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.chat-name {
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.chat-preview {
		font-size: 0.85em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #555;
	}
	.chat-preview.empty {
		font-style: italic;
		color: #999;
	}
	.chat-time {
		font-size: 0.75em;
		color: #999;
	}
	.chat-row.selected .chat-row-btn {
		background: #e8f0fe;
	}
</style>
