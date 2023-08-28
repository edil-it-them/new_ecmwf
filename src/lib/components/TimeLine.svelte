<script lang="ts">
	import { viewport, videoTime, selectedCity } from '$lib/store';

	import { scaleBand } from 'd3-scale';
	import Column from './Column.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import MultiLine from './MultiLine.svelte';
	import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';
	import Labels from './GroupLabels.html.svelte';
	import SharedTooltip from './SharedTooltip.html.svelte';

	import { scaleOrdinal } from 'd3-scale';
	import { timeParse, timeFormat } from 'd3-time-format';
	import { format, precisionFixed } from 'd3-format';
	import dataAll from '$lib/glob_temperatures.csv';

	const xKey = 'day';
	const yKey = 'value';
	const zKey = 'temperature';

	// const xKeyCast = timeParse('%d');

	const seriesColors = [
		'rgb(185, 28, 28)',
		'rgb(29, 78, 216)',
		'rgb(107 33 168)',
		'rgb(239, 68, 68)',
		'rgb(30 64 175)',
		'rgb(147 51 234'
	];

	/* --------------------------------------------
	 * Cast values
	 */
	// const formatTickX = timeFormat('%b. %e');
	let data = dataAll;
	let seriesNames = Object.keys(data[0]).filter((d) => d !== xKey);
	data.forEach((d) => {
			d[xKey] = typeof d[xKey] === 'string' ? xKeyCast(d[xKey]) : d[xKey];

			seriesNames.forEach((name) => {
				d[name] = +d[name];
			});
		});
	let groupedData = groupLonger(data, seriesNames, {
			groupTo: zKey,
			valueTo: yKey
		});
	const formatTickY = (d) => d;
	// $: {
	// 	console.log($selectedCity, dataAll)
	// 	data = $selectedCity.length >0 ? $selectedCity : dataAll;
	// 	seriesNames = Object.keys(data[0]).filter((d) => d !== xKey);
	// 	data.forEach((d) => {
	// 		d[xKey] = typeof d[xKey] === 'string' ? xKeyCast(d[xKey]) : d[xKey];

	// 		seriesNames.forEach((name) => {
	// 			d[name] = +d[name];
	// 		});
	// 	});

	// 	groupedData = groupLonger(data, seriesNames, {
	// 		groupTo: zKey,
	// 		valueTo: yKey
	// 	});
	// }
</script>

<div class="absolute bottom-0 w-full h-1/5 text-white px-10 mb-2">

	<LayerCake
		padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
		x={xKey}
		y={yKey}
		z={zKey}
		yDomain={[3, 12]}
		zScale={scaleOrdinal()}
		zRange={seriesColors}
		flatData={flatten(groupedData, 'values')}
		data={groupedData}
	>
		<Svg>
			<AxisX
				gridlines={false}
				ticks={data.map((d) => d[xKey]).sort((a, b) => a - b)}
				snapTicks={true}
			/>
			<AxisY ticks={5} formatTick={formatTickY} />
			<MultiLine />
		</Svg>
		<Html>
			<Labels />
			<SharedTooltip dataset={data} />
		</Html>
	</LayerCake>
</div>


<!-- <svg
	class="absolute left-0 top-0 transition-all opacity-20  pointer-events-none"
	style="transform: translateX({annotationPos -
		annotationW / 2}px); width:{annotationW}px; height:{annotationH}px"
	fill="none"
	stroke-linecap="round"
	stroke-linejoin="round"
	stroke-width={annotationW}
	viewBox="0 0 1 100"
	stroke="currentColor"
>
	<path d="M1 135V1" />
</svg> -->
