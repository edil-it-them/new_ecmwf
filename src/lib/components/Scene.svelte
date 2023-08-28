<script lang="ts">
	import { T } from '@threlte/core';

	import {
		OrbitControls,
	} from '@threlte/extras';
	import VideoPlane from './VideoPlane.svelte';
</script>

<T.PerspectiveCamera makeDefault position={[250, 0, 0]} fov={30} far={10000}>
	<OrbitControls enableZoom={true} enableDamping autoRotateSpeed={1.2} target.y={1} autoRotate={true}/>
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.1} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />
<VideoPlane />