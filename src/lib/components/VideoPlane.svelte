<script lang="ts">
	import { T } from '@threlte/core';
	import { BufferGeometry, VideoTexture, BufferAttribute, LinearFilter, FrontSide } from 'three';
	import { video, videoBorders, showWaves, opacity, videoLoaded, videoBLoaded } from '$lib/store';
	// import {useTe}
	// const video = useTexture('743.png');

	const videoTex = new VideoTexture($video);
	const videoTexBorders = new VideoTexture($videoBorders);
	videoTex.minFilter = LinearFilter;
	let geometry = new BufferGeometry();
	let width = $video.videoWidth / 2;
	let height = $video.videoHeight / 2;
	let nearClipping = 500;
	let farClipping = 2000;
	let vertices = new Float32Array(width * height * 3);
	const gridSize = 500; // Adjust the grid size for denser points
	const pointSize = 2; // Adjust the point size for denser appearance

	// Create the positions for the points in a denser grid
	// let vertices = new Float32Array(numPoints * 3);

	for (let i = 0, j = 0, l = vertices.length; i < l; i += 3) {
		const x = (i / 3) % gridSize;
		const y = Math.floor(i / 3 / gridSize);
		vertices[i] = x;
		vertices[i + 1] = y;
		vertices[i + 2] = 0; // All points at the same height (plane)
	}

	for (let i = 0, j = 0, l = vertices.length; i < l; i += 3, j++) {
		vertices[i] = j % width;
		vertices[i + 1] = Math.floor(j / width);
	}

	const vs = `
			uniform sampler2D map;

			uniform float width;
			uniform float radius;
			uniform float height;
			uniform float nearClipping, farClipping;

			uniform float pointSize;
			uniform float zOffset;

			varying vec2 vUv;

			const float XtoZ = 1.11146; // tan( 1.0144686 / 2.0 ) * 2.0;
			const float YtoZ = 0.83359; // tan( 0.7898090 / 2.0 ) * 2.0;
			
			void main() {
				vUv = vec2(position.x / width, position.y / height);

				vec4 color = texture2D(map, vUv);
				float depth = (color.b + color.g) /7.0;
				// Calculate a threshold for almost black
				//float threshold = 0.05; // Adjust this threshold as needed

				// Check if the color is almost black (all channels close to 0)
				//bool isBlack = color.r < threshold && color.g < threshold && color.b < threshold;

				// If the color is black, set depth to 0, otherwise apply depth-based scaling
				float scaleFactor = mix(1.0, -1.0, depth);

				// Calculate spherical coordinates
				float theta = vUv.y * 3.14159265359;
				float phi = vUv.x * 2.0 * 3.14159265359;

				// Convert spherical coordinates to Cartesian coordinates
				float x = radius * scaleFactor * sin(theta) * cos(phi);
				float y = radius * scaleFactor * cos(theta);
				float z = radius * scaleFactor * sin(theta) * sin(phi);

				// Set the vertex position
				vec4 pos = vec4(x, y, z + zOffset, 1.0);

				gl_PointSize = pointSize;
				gl_Position = projectionMatrix * modelViewMatrix * pos;
				}
            `;

	const fs = `
    uniform sampler2D map;

    varying vec2 vUv;

    void main() {

    vec4 color = texture2D( map, vUv );
    gl_FragColor = vec4( color.r, color.g, color.b, 1.0 );

    }`;
</script>

{#if videoTex.isVideoTexture}
	<T.Mesh scale={48}>
		<T.SphereGeometry />
		<T.MeshBasicMaterial map={videoTexBorders} transparent={true} opacity={$opacity} />
	</T.Mesh>

	<!-- {#if $showWaves} -->
	<T.Points rotation={[Math.PI, Math.PI, 0]} scale={0.1}>
		<T.BufferGeometry attributes={{ position: new BufferAttribute(vertices, 3) }} />
		<T.ShaderMaterial
			uniforms={{
				map: { value: videoTex },
				radius: { value: width / 2 },
				width: { value: width },
				height: { value: height },
				nearClipping: { value: nearClipping },
				farClipping: { value: farClipping },

				pointSize: { value: pointSize },
				zOffset: { value: 0 }
			}}
			vertexShader={vs}
			fragmentShader={fs}
			depthTest={true}
			depthWrite={true}
			transparent={false}
			side={FrontSide}
		/>
	</T.Points>
{/if}
