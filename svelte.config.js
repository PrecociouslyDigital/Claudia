import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// BASE_PATH injected by CI (actions/configure-pages). Empty locally.
		paths: { base: process.env.BASE_PATH ?? '' }
	},
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx']
};

export default config;
