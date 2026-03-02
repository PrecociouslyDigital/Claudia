<script lang="ts">
	import { appState } from '../state.svelte.js';
	import { formatTime } from '../time.js';
</script>

<ul class="selector">
	{#each appState.chats as chat, i (chat.name)}
		{@const lastMsg = chat.messages.at(-1)}
		<li aria-current={appState.currentlySelected === i ? 'true' : undefined}>
			<button onclick={() => (appState.currentlySelected = i)}>
				<figure>
					<img src={chat.profilePicture} alt={chat.name} />
					<span data-status={chat.status}></span>
				</figure>
				<div>
					<strong>{chat.name}</strong>
					{#if lastMsg}
						<small>{lastMsg.role === 'user' ? `You: ${lastMsg.text}` : lastMsg.text}</small>
						<time datetime={lastMsg.time.toISOString()}>{formatTime(lastMsg.time)}</time>
					{:else}
						<small class="empty">No messages yet</small>
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

	button {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 8px;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
	}

	figure {
		position: relative;
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		margin: 0;
		margin-right: 8px;
	}

	figure img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		background: #ccc;
	}

	figure span {
		position: absolute;
		bottom: 1px;
		right: 1px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid white;
	}

	figure span[data-status='active'] {
		background: #4caf50;
	}
	figure span[data-status='away'] {
		background: #ff9800;
	}
	figure span[data-status='busy'] {
		background: #f44336;
	}
	figure span[data-status='offline'] {
		background: #9e9e9e;
	}

	div {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	strong {
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	small {
		font-size: 0.85em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #555;
	}

	small.empty {
		font-style: italic;
		color: #999;
	}

	time {
		font-size: 0.75em;
		color: #999;
	}

	li[aria-current] button {
		background: #e8f0fe;
	}
</style>
