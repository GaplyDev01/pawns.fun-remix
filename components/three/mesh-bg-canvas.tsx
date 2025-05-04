"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { MotionValue } from "framer-motion"
import type * as THREE from "three"

function Grid({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
      materialRef.current.uniforms.uMouseX.value = mouseX.get()
      materialRef.current.uniforms.uMouseY.value = mouseY.get()
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40, 20, 20]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uMouseX: { value: 0 },
          uMouseY: { value: 0 },
          uColor1: { value: [0, 0.89, 1] }, // #00E3FF
          uColor2: { value: [0.45, 0.33, 1] }, // #7353FF
        }}
        vertexShader={`
          uniform float uTime;
          uniform float uMouseX;
          uniform float uMouseY;
          
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            
            // Add some wave effect
            float wave = sin(position.x * 0.5 + uTime) * 0.1;
            wave += sin(position.y * 0.5 + uTime) * 0.1;
            
            // Add mouse influence
            float mouseEffect = distance(vec2(position.x * 0.025, position.y * 0.025), vec2(uMouseX, uMouseY)) * 2.0;
            mouseEffect = max(0.0, 1.0 - mouseEffect);
            
            vec3 pos = position;
            pos.z += wave;
            pos.z += mouseEffect * 0.5;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          
          varying vec2 vUv;
          
          void main() {
            // Grid pattern
            float gridX = step(0.98, sin(vUv.x * 20.0) * 0.5 + 0.5);
            float gridY = step(0.98, sin(vUv.y * 20.0) * 0.5 + 0.5);
            float grid = max(gridX, gridY) * 0.5;
            
            // Gradient based on position
            vec3 color = mix(uColor1, uColor2, vUv.y);
            
            // Fade grid based on distance from center
            float dist = distance(vUv, vec2(0.5));
            float alpha = smoothstep(1.0, 0.0, dist * 1.5) * 0.3;
            
            gl_FragColor = vec4(color, grid * alpha);
          }
        `}
        transparent={true}
      />
    </mesh>
  )
}

export default function MeshBGCanvas({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
      <Grid mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  )
}
