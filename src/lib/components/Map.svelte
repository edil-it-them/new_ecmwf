<script lang="ts">
	import { T } from '@threlte/core';
	import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
	import type { Group, Shape } from 'three';
	import { Vector3, Box3 } from 'three';
	import mapSvg from '$lib/earth-flat.svg?src';
	import MapPart from './MapPart.svelte';
	const svgToGeometry = (svg: string) => {
		// console.log(ukrSvg);
		let shapes: any[] | Shape[] = [];
		const loader = new SVGLoader();
		const data = loader.parse(svg);

		const shapePaths = data.paths;
		// console.log(data, shapePaths, 'shapePaths');
		shapePaths.forEach((shapePath) => {
			const shape = SVGLoader.createShapes(shapePath);
			// const region = shapePath.userData?.node.attributes.title.value;
			shape.forEach((element) => {
				// element['region'] = region;
                // console.log(element, 'shape map')
			});
			// console.log(shape, 'shape');
			shapes = [...shapes, ...shape];
		});

		return shapes;
	};
	const shapes = svgToGeometry(mapSvg);
	export let map: Group;
	// export let mapWidth: number = 0;
	// export let mapHeight: number = 0;
	// $: console.log(mapWidth, mapHeight, 'dimensions')
	$: {
		if (map) {
			let box = new Box3().setFromObject(map);
			new Box3().setFromObject(map).getCenter(map.position).multiplyScalar(-1); // this centers the map
			// if (box) {
			// 	let mapDim = box.getSize(new Vector3());
			// 	mapWidth = mapDim?.x - 5;
			// 	mapHeight = mapDim?.z - 5;
			// }
		}
	}
	
</script>

<T.Group bind:ref={map}>
	{#each shapes as shape}
		<MapPart {shape} />
	{/each}
</T.Group>
