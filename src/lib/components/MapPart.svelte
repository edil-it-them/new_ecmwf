<script lang="ts">
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { derived } from 'svelte/store';
	import { Shape } from 'three';
	// import {
	// 	day,
	// 	finished,
	// 	hoverMouse,
	// 	hoverRegion,
	// 	regionDayFires,
	// 	started,
	// 	tooltip,
	// 	viewport,
	// 	regionFires,
	// 	scrollPart
	// } from './store';
	export let shape: ShapeR;
	class ShapeR extends Shape {
		region!: string;
	}
	// let color = 'white';
	// shape.region
	// const regions = {
	// 	Dnipropetrovsk: 'Дніпропетровська',
	// 	Donetsk: 'Донецька',
	// 	Zhytomyr: 'Житомирська',
	// 	Kyiv: 'Київ',
	// 	'Kyiv region': 'Київська',
	// 	Luhansk: 'Луганська',
	// 	Odessa: 'Одеська',
	// 	Sumy: 'Сумська',
	// 	Kharkiv: 'Харківська',
	// 	Chernihiv: 'Чернігівська',
	// 	Vinnytsya: 'Вінницька',
	// 	Zaporizhzhya: 'Запорізька',
	// 	Rivne: 'Рівненська',
	// 	Kherson: 'Херсонська',
	// 	Cherkasy: 'Черкаська',
	// 	Lviv: 'Львівська',
	// 	Mykolayiv: 'Миколаїв',
	// 	'Ivano-Frankivsk': 'Івано-Франківська',
	// 	Volyn: 'Волинська',
	// 	Khmelnytskyi: 'Хмельницька',
	// 	Poltava: 'Полтавська',
	// 	Ternopil: 'Тернопільська',
	// 	Kirovohrad: 'Кіровоградська',
	// 	Transcarpathia: 'Закарпатська',
	// 	Chernivtsi: 'Чернівецька'
	// };
	// $: {
	// 	$day;
	// 	$hoverRegion;
	// 	!$finished ? changeMapColor() : changeMapColor(true);
	// }
	// const changeMapColor = (finished = false) => {
	// 	const firesInRegion = finished
	// 		? $regionFires.get(regions[shape.region])?.reduce((a, c) => a + c, 0)
	// 		: $regionDayFires.get(regions[shape.region]);
	// 	const allFires = finished
	// 		? [...$regionFires.values()].map((d) => d.reduce((a, c) => a + c, 0))
	// 		: [...$regionDayFires.values()];
	// 	if ($hoverRegion != shape.region) {
	// 		firesInRegion
	// 			? colorTween.set(255 - (firesInRegion / Math.max(...allFires)) * 255)
	// 			: colorTween.set(255);
	// 	} else if ($hoverRegion == shape.region) {
	// 		firesInRegion ? colorTween.set(40) : colorTween.set(180);
	// 	}
	// };

	// $: {
	// 	if ($scrollPart == 3) {
	// 		colorTween.set(Math.random() * 255);
	// 	} else if ($scrollPart == 2) {
	// 		colorTween.set(255);
	// 	}
	// }
	const colorTween = tweened(255);
	const color = derived(colorTween, (c) => {
		const r = c << 0; // alternative to Math.floor(c)
		return `rgb(255, ${r}, ${r})`;
	});
	const hoveredColor = derived(colorTween, (c) => {
		const r = c << 0; // alternative to Math.floor(c)
		return `rgb(${r + 10}, ${r}, ${r})`;
	});
	// const opacity = tweened(0);
	// onMount(() => {
	// 	opacity.set(1);
	// });
</script>

<T.Mesh rotation.x={90 * (Math.PI / 180)} receiveShadow let:ref>
	<T.ExtrudeGeometry
		args={[
			shape,
			{
				depth: 5,
				steps: 1,
				bevelEnabled: false // bevel true makes performance drop
				// bevelThickness:1,
				// bevelSize: 1,
				// bevelOffset: 0,
				// bevelSegments: 1
			}
		]}
	/>
	<T.MeshStandardMaterial />
	<!-- {#if $started}
		<InteractiveObject
			interactive
			object={ref}
			on:pointerenter={() => {
				if ($viewport.width > 400) {
					$hoverMouse = true;
					$tooltip.visible = true;
					$hoverRegion = shape.region;
				}
			}}
			on:pointerleave={() => {
				// if ($viewport.width > 400) {
				$hoverMouse = false;
				$tooltip.visible = false;
				$hoverRegion = '';
				// }
			}}
			on:pointermove={(e) => {
				if ($viewport.width > 400) {
					if ((e.detail.event?.clientX || 0) > $viewport.width / 2) {
						$tooltip.toRight = true;
					} else {
						$tooltip.toRight = false;
					}
					$tooltip.x = e.detail.point.x ?? 0;
					$tooltip.z = e.detail.point.z ?? 0;
					$tooltip.d = e.detail.distance ?? 0;
				}
			}}
			on:click={(e) => {
				if ((e.detail.event?.clientX || 0) > $viewport.width / 2) {
					$tooltip.toRight = true;
				} else {
					$tooltip.toRight = false;
				}
				$tooltip.visible = true;
				$hoverRegion = shape.region;
				$tooltip.x = e.detail.point.x ?? 0;
				$tooltip.z = e.detail.point.z ?? 0;
				$tooltip.d = e.detail.distance ?? 0;
			}}
		/>
	{/if} -->
</T.Mesh>
