// @ts-check
import react from '@astrojs/react';
import solidJs from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	integrations: [
		react({
			include: ['**/react/*'],
		}),
		solidJs({
			include: ['**/solid/*'],
		}),
		svelte(),
		vue(),
	],
	vite: {
		resolve: {
			conditions: ['browser'],
		},

		// @ts-ignore
		plugins: [tailwindcss()],
	},
});
