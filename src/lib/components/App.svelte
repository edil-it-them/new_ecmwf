<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import { showWaves, video, videoBorders, opacity, videoTime, recording } from '$lib/store';
	import TimeLine from './TimeLine.svelte';
	import { tweened } from 'svelte/motion';
	import { useProgress } from '@threlte/extras';
	let showCalendar = false
	// $:{if ($videoBorders) $videoBorders.currentTime = $videoTime}
	let twOp = tweened(1);
	$: $opacity = $twOp;
	const { progress } = useProgress()

	const tweenedProgress = tweened($progress, {
		duration: 800
	})
	$: tweenedProgress.set($progress)
</script>

<video
	bind:currentTime={$videoTime}
	style="display:none"
	loop
	bind:this={$video}
	src="hourly.mp4"
/>
<!-- svelte-ignore a11y-media-has-caption -->
<video
	currentTime={$videoTime}
	style="display:none"
	bind:this={$videoBorders}
	src="hourly_borders.mp4"
	loop
/>

<button
	class="absolute left-0 z-50 p-2"
	on:click={() => {
		if ($video.paused) {
			$video.play();
			$videoBorders.play();
			// twOp.set(0.35, { duration: 20000 }).then(() => twOp.set(1, { duration: 20000 }));
		} else {
			$video.pause();
			$videoBorders.pause();
		}
	}}
	><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
		{#if $video?.paused}
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M9.5547 6.16795C9.24784 5.96338 8.8533 5.94431 8.52814 6.11833C8.20298 6.29234 8 6.6312 8 7V15C8 15.3688 8.20298 15.7077 8.52814 15.8817C8.8533 16.0557 9.24784 16.0366 9.5547 15.8321L15.5547 11.8321C15.8329 11.6466 16 11.3344 16 11C16 10.6656 15.8329 10.3534 15.5547 10.1679L9.5547 6.16795ZM13.1972 11L10 13.1315V8.86852L13.1972 11Z"
				fill="white"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0ZM2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11Z"
				fill="white"
			/>
		{:else}
			<path
				xmlns="http://www.w3.org/2000/svg"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10 8C10.5523 8 11 8.44772 11 9V15C11 15.5523 10.5523 16 10 16C9.44771 16 9 15.5523 9 15V9C9 8.44772 9.44771 8 10 8ZM15 9C15 8.44772 14.5523 8 14 8C13.4477 8 13 8.44772 13 9V15C13 15.5523 13.4477 16 14 16C14.5523 16 15 15.5523 15 15V9Z"
				fill="white"
			/>
		{/if}
	</svg></button
>

<div class="absolute right-0 flex flex-col text-white z-50 mr-5" class:hidden={$recording}>
	<label class="justify-end self-end" for="opacityRange">Opacity:</label>
	<input
		class="w-20"
		type="range"
		id="opacityRange"
		min="0"
		max="1"
		step="0.01"
		bind:value={$opacity}
	/>
</div>
{#if $tweenedProgress < 1}
	<div
		transition:fade|local={{
			duration: 200
		}}
		class="wrapper"
	>
		<p class="loading">Loading</p>
		<div class="bar-wrapper">
			<div class="bar" style="width: {$tweenedProgress * 100}%" />
		</div>
	</div>
{/if}

<div class="flex w-full h-full">
	<Calendar bind:showCalendar />
	<div class="{showCalendar ? 'w-1/2' : 'w-full'} relative">
		<Canvas>
			<Scene />
		</Canvas>
		<TimeLine />
	</div>
</div>
<!-- Timeline -->

<style>
	.wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: white;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		align-items: center;
		justify-content: center;
		color: black;
	}

	.loading {
		font-size: 0.875rem;
		line-height: 1.25rem;
	}

	.bar-wrapper {
		width: 33.333333%;
		height: 10px;
		border: 1px solid black;
		position: relative;
	}

	.bar {
		height: 100%;
		background-color: black;
	}
</style>
