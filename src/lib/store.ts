import { writable, readable } from 'svelte/store';
import { browser } from '$app/environment';
// import debounce from 'lodash.debounce';

export const video = writable<HTMLVideoElement>();
export const videoBorders = writable<HTMLVideoElement>();
export const showWaves = writable(false);
export const opacity = writable(1);
export const videoTime = writable(0);
export let selectedCity = writable([])
export let recording = readable(false)

function debounce(func: { (): void; apply?: any; }, delay: number | undefined) {
	let timeoutId: number | undefined;

	return function (...args: any) {
		const context = this;

		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};
}

export const viewport = readable({ width: 0, height: 0 }, (set) => {
	const onResize = () => set({ width: window.innerWidth, height: window.innerHeight });

	if (browser) {
		onResize();
		window.addEventListener('resize', debounce(onResize, 250));
	}

	return () => {
		if (browser) window.removeEventListener('resize', onResize);
	};
});
