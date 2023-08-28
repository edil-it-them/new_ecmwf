import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';
import dsv from '@rollup/plugin-dsv';

export default defineConfig({
	plugins: [sveltekit(), svg({
		svgoOptions: {
			plugins: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							mergePaths: false,
							removeUnknownsAndDefaults: false
						}
					}
				}
			]
		}
	}),dsv({
		processRow: (row, id) => {
			Object.keys(row).forEach((key) => {
				var value = row[key];
				row[key] = isNaN(+value) ? value : +value;
			});
		}
	})],
	ssr: {
		noExternal: ['three']
	}
});
