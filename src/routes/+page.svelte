<script lang="ts">
	import App from '$lib/components/App.svelte';
	
</script>

<main class="relative">

	<App />
</main>

<style>
	:global(body) {
		margin: 0;
	}

	main {
		width: 100vw;
		height: 100vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}

	.controls {
		position: absolute;
		top: 0;
		width: auto;
		height: auto;
	}
</style>
