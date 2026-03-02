<script lang="ts">
	import { appState } from '../state.svelte.js';
	import { formatTime } from '../time.js';

	const chat = $derived(appState.chats[appState.currentlySelected]);

	let messagesEl: HTMLUListElement = $state()!;

	// Scroll-lock: true = auto-follow new messages. Captured before DOM changes
	// to avoid post-update timing issues.
	let scrollLocked = true;

	function onScroll() {
		if (!messagesEl) return;
		scrollLocked = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 16;
	}

	// Always start at the bottom when opening a different chat
	$effect(() => {
		appState.currentlySelected;
		scrollLocked = true;
	});

	// After each DOM update, scroll only if the user was already at the bottom
	$effect(() => {
		chat.messages.length;
		if (scrollLocked) messagesEl?.scrollTo({ top: messagesEl.scrollHeight });
	});
</script>

<section class="chat">
	<header>
		<figure>
			<img src={chat.profilePicture} alt={chat.name} />
			<span data-status={chat.status}></span>
		</figure>
		<div>
			<h2>{chat.name}</h2>
			<small>{chat.statusText}</small>
		</div>
	</header>

	{#if chat.messages.length === 0}
		<p class="empty">No messages yet. Say something.</p>
	{:else}
		<ul bind:this={messagesEl} onscroll={onScroll}>
			{#each chat.messages as msg, i (i)}
				<li data-role={msg.role}>
					{#if msg.role === 'partner'}
						<img src={chat.profilePicture} alt={chat.name} />
					{/if}
					<p>
						{msg.text}
						<time datetime={msg.time.toISOString()}>{formatTime(msg.time)}</time>
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.chat {
		display: flex;
		flex-direction: column;
		/* flex:1 fills the conversation column; min-height:0 lets the ul shrink and scroll */
		flex: 1;
		min-height: 0;
	}

	header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px;
		border-bottom: 1px solid #ddd;
		background: white;
		position: sticky;
		top: 0;
	}

	header figure {
		position: relative;
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		margin: 0;
	}

	header figure img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		background: #ccc;
	}

	header figure span {
		position: absolute;
		bottom: 1px;
		right: 1px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid white;
	}

	header figure span[data-status='active'] {
		background: #4caf50;
	}
	header figure span[data-status='away'] {
		background: #ff9800;
	}
	header figure span[data-status='busy'] {
		background: #f44336;
	}
	header figure span[data-status='offline'] {
		background: #9e9e9e;
	}

	header h2 {
		margin: 0;
		font-size: 1em;
	}

	header small {
		color: #555;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		/* Scrollable container: flex:1 fills remaining chat height; min-height:0
		   overrides flex's default min-height:auto which would prevent overflow */
		flex: 1;
		overflow-y: auto;
		min-height: 0;
	}

	li {
		display: flex;
		align-items: flex-end;
		gap: 6px;
	}

	li[data-role='user'] {
		justify-content: flex-end;
	}

	li[data-role='partner'] {
		justify-content: flex-start;
	}

	li img {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #ccc;
		flex-shrink: 0;
	}

	li p {
		max-width: 60%;
		margin: 0;
		padding: 6px 10px;
		border-radius: 12px;
		word-break: break-word;
	}

	li[data-role='user'] p {
		background: #0084ff;
		color: white;
		border-bottom-right-radius: 2px;
	}

	li[data-role='partner'] p {
		background: #e9e9eb;
		border-bottom-left-radius: 2px;
	}

	time {
		display: block;
		font-size: 0.7em;
		opacity: 0.65;
	}

	.empty {
		color: #999;
		font-style: italic;
		text-align: center;
		padding: 16px;
	}
</style>
