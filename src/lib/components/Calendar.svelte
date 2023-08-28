<script lang="ts">
	import { recording, selectedCity, video, videoTime } from '$lib/store';
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import ranking from '$lib/city_ranking.csv';
	let cityData: any[] = [];
	let globData: any[] = [];
	let dataLoading = true;
	onMount(async () => {
		globData = (await import('$lib/glob_temperatures.csv')).default;
		$selectedCity = globData;
		cityData = (await import('$lib/city_temperatures-full.csv')).default;
		dataLoading = false;

		// getGeolocation();
	});
	// let cityNames = []

	$: cityNames = [...new Set(cityData.map((d) => `${d.name}, ${d.country}`))].sort((a, b) =>
		a.localeCompare(b)
	);
	// let $selectedCity: any[] = [];
	// $: $selectedCity = cityData.filter((d) => d.name == 'Bishkek');
	let searchText = '';
	// let $selectedCity: any[] = [];
	// let filteredCity = '';
	// $: $selectedCity
	let latitude = null;
	let longitude = null;
	$: {
		$selectedCity.map((d) => {
			d.maxDifference = d.max - d.max_climatology;
			d.minDifference = d.min - d.min_climatology;
			d.meanDifference = d.mean - d.mean_climatology;
		});
	}
	$: maxDifference = Math.max(...$selectedCity.map((d) => Math.abs(d.maxDifference)));
	$: minDifference = Math.max(...$selectedCity.map((d) => Math.abs(d.minDifference)));
	$: meanDifference = Math.max(...$selectedCity.map((d) => Math.abs(d.meanDifference)));
	$: absDiff = Math.max(minDifference, maxDifference, meanDifference);

	$: console.log(maxDifference, meanDifference, minDifference, absDiff, $selectedCity, 'maxdiff');

	// async function getGeolocation() {
	// 	if ('geolocation' in navigator) {
	// 		try {
	// 			await navigator.geolocation.getCurrentPosition((position) => {
	// 				latitude = position.coords.latitude;
	// 				longitude = position.coords.longitude;
	// 			});
	// 		} catch (error) {
	// 			console.error('Error retrieving geolocation:', error.message);
	// 		}
	// 	} else {
	// 		console.error('Geolocation is not available in this browser.');
	// 	}
	// }

	// function calculateDistance(lat1, lon1, lat2, lon2) {
	// 	const R = 6371; // Earth's radius in km
	// 	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	// 	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	// 	const a =
	// 		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	// 		Math.cos((lat1 * Math.PI) / 180) *
	// 			Math.cos((lat2 * Math.PI) / 180) *
	// 			Math.sin(dLon / 2) *
	// 			Math.sin(dLon / 2);
	// 	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	// 	const distance = R * c;
	// 	return distance;
	// }
	export let showCalendar = false;
	let toolTip: number | null = null;
	// let recording = true
	let showRanking = false;
</script>

<button
	class="absolute -translate-x-1/2 left-1/2 text-white z-50"
	class:hidden={showCalendar || $recording}
	on:click={() => (showCalendar = !showCalendar)}>{showCalendar ? 'hide' : 'show'} calendar</button
>
{#if showCalendar}
	<div class="flex-1 bg-white p-4 rounded-lg relative h-fit self-center ml-6" in:fade>
		<button
			class="absolute right-2 top-0"
			on:click={() => {
				showCalendar = false;
			}}>x</button
		>
		<div class="mb-2">
			<input
				type="text"
				bind:value={searchText}
				placeholder={dataLoading ? 'Loading city data' : 'Select city'}
				disabled={dataLoading}
			/>
			{#if searchText}
				<div
					class="max-h-32 overflow-auto bg-white flex-col flex text-start items-start w-1/2 absolute z-50 shadow border rounded-b"
				>
					{#each cityNames.filter((item) => item
							.toLowerCase()
							.includes(searchText.toLowerCase())) as item}
						<button
							class="hover:opacity-70 transition-all w-full text-start bg-white"
							on:click={() => {
								$selectedCity = cityData.filter(
									(d) => d.name == item.split(',')[0] && d.country == item.split(',')[1].trim()
								);
								searchText = '';
								showRanking = false
							}}>{item}</button
						>
					{/each}
				</div>
			{/if}
		</div>
		
			<div class="text-sm absolute right-5 top-1">

				<button class="opacity-50 hover:opacity-100" class:hidden={!showRanking} on:click={() => {
					showRanking = false;
				}}>back</button>
				<button class="opacity-50 hover:opacity-100" class:hidden={showRanking} on:click={() => (showRanking = true)}
					>city ranking</button
				>
				{#if $selectedCity[0]?.name}
				|
				<button class="opacity-50 hover:opacity-100" on:click={() => ($selectedCity = globData)}
					>global °C</button
				>
				{/if}
			</div>
		
		{#if showRanking}
			<div class="flex overflow-x-auto">
				<div class="grid max-h-96">
					<p class="text-left w-1/2">Ranking of cities that experienced highest temperature differences between daily high and climatology maximum.</p>
					{#each ranking as rank, i}
						<button
							class="w-fit text-left"
							on:click={() => {
								$selectedCity = cityData.filter(
									(d) => d.name == rank.name && d.country == rank.country
								);
								showRanking = false;
							}}
						>
							{i + 1}. {rank.name}, {rank.country}
						</button>
					{/each}
				</div>
				
			</div>
		{/if}

		{#if $selectedCity[0] && !showRanking}
			{@const maxT = [...$selectedCity].sort((a, b) => b.max - a.max)[0]}
			<div class="">
				<!-- <p>During the month of July 2023, Bishkek experienced temperatures that were higher than the average temperatures for the same days during the period from 1990 to 2020</p> -->
				<div class="mb-4">
					<p class="">
						In July 2023, <span class="font-bold">{$selectedCity[0].name || 'Earth'}</span> experienced {$selectedCity.filter(
							(d) => d.meanDifference > 0
						).length} days that were <span class="bg-red-300 rounded">hotter</span> than the average
						air temperatures for the same days during 1990-2020. On {maxT.day} July air temperature peaked
						at <span class="bg-red-300 rounded">{maxT.max}°C</span> which was <span class="bg-red-300 rounded">{maxT.maxDifference.toFixed(1)}°C</span> higher than
						average climatological maximum.
					</p>
				</div>
				<div class="grid grid-cols-7 gap-2">
					{#each $selectedCity as day, i (day)}
						{@const minDif = (day.minDifference / absDiff) * 50}
						{@const maxDif = (day.maxDifference / absDiff) * 50}
						{@const meanDif = (day.meanDifference / absDiff) * 50}
						<!-- {console.log(meanDif)} -->
						<!-- {console.log(minDif, maxDif, day.day)} -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class:font-bold={Math.floor($videoTime / 2) == i}
							class:scale-105={Math.floor($videoTime / 2) == i}
							style={`--tw-bg-opacity: ${Math.abs(meanDif * 2)}%;`}
							class="{meanDif > 0
								? 'bg-red-300'
								: meanDif == 0
								? 'bg-white'
								: 'bg-blue-300'}  pb-[100%] relative rounded shadow cursor-pointer transition-all"
							in:fade={{ delay: i * 20 }}
							on:mouseenter={() => {
								console.log(day);
								toolTip = i + 1;
							}}
							on:mouseleave={() => {
								toolTip = null;
							}}
						>
							{#if toolTip == i + 1}
								<div
									class="text-xs absolute bg-white shadow z-50 bottom-full w-fit p-2 rounded pointer-events-none flex"
								>
									<div class="pr-1">
										<p class="font-bold">1990-2020</p>
										<p>max: {day.max_climatology}</p>
										<p>mean: {day.mean_climatology}</p>
										<p>min: {day.min_climatology}</p>
									</div>
									<div class="border-l px-1">
										<p class="font-bold">2023</p>
										<p>{day.max}</p>
										<p>{day.mean}</p>
										<p>{day.min}</p>
									</div>

									<div class="border-l pl-1">
										<p class="font-bold">difference</p>
										<p>{day.maxDifference.toFixed(1)}</p>
										<p>{day.meanDifference.toFixed(1)}</p>
										<p>{day.minDifference.toFixed(1)}</p>
									</div>
									<p class="absolute bottom-1 right-2">°C</p>
								</div>
							{/if}
							<div
								class="{maxDif * minDif > 0 ? 'w-1/2' : 'w-full'} absolute {maxDif > 0
									? 'bottom-1/2'
									: 'top-1/2'} bg-red-500 rounded"
								style={`height:${Math.abs(maxDif)}%`}
							/>
							<div
								class="{maxDif * minDif > 0 ? 'w-1/2 left-1/2' : 'w-full'} absolute {minDif > 0
									? 'bottom-1/2'
									: 'top-1/2'} bg-blue-500 rounded"
								style={`height:${Math.abs(minDif)}%`}
							/>
							<hr
								class="absolute opacity-80 {meanDif > 0
									? 'border-red-900'
									: 'border-blue-900'} w-full"
								style={`top: ${50 - meanDif}%`}
							/>
							<!-- <hr class="absolute opacity-20 border-[0.5px] border-black top-1/2 w-full" /> -->
							<p class="absolute left-1 top-0 text-sm">{day.day}</p>
						</div>
					{/each}
					{#key $selectedCity[0].name}
						<div class="flex justify-between text-xs" in:slide={{ delay: 31 * 20 }}>
							<div class="relative flex flex-col justify-between">
								<hr class="ticks top-0" />
								<hr class="ticks bottom-1/2" />
								<hr class="ticks bottom-0" />
								<p class="">+{absDiff.toFixed(1)}</p>
								<p class="">0 °C</p>
								<p class="">-{absDiff.toFixed(1)}</p>
							</div>
							<div class="flex flex-col items-end justify-end relative">
								<div class="opacity-80 border-red-900 w-5 border-t relative my-2">
									<p class="whitespace-nowrap absolute left-[115%] top-1/2 -translate-y-1/2">
										daily mean°C difference
									</p>
								</div>
								<div class="rounded w-5 h-5 bg-red-500 relative my-1">
									<p class="whitespace-nowrap absolute left-[115%] top-1/2 -translate-y-1/2">
										daily max°C difference
									</p>
								</div>
								<div class="rounded w-5 h-5 bg-blue-500 relative">
									<p class="whitespace-nowrap absolute left-[115%] top-1/2 -translate-y-1/2">
										daily min°C difference
									</p>
								</div>
							</div>
						</div>
					{/key}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	.ticks {
		@apply absolute w-[5px] border-black left-[-8px] opacity-30;
	}
</style>
