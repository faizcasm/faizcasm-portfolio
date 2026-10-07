"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Decorative WebGL scene used as the hero backdrop:
 * a wireframe icosahedron orbited by a particle shell and two rings.
 * Purely visual — it renders behind the content with no pointer capture.
 */

function ParticleShell({ count = 600 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.1 + Math.random() * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.05;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#60a5fa"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function CoreMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.12;
      mesh.current.rotation.y += delta * 0.16;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.3;
      inner.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.45, 1]} />
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.55}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.45}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
}: {
  radius: number;
  tilt: number;
  speed: number;
  color: string;
}) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ring.current) return;
    ring.current.rotation.z += delta * speed;
    ring.current.rotation.x = tilt + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <mesh ref={ring} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 8, 160]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

export default function HeroSceneCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 5]} intensity={90} color="#60a5fa" />
      <pointLight position={[-4, -2, 3]} intensity={60} color="#a855f7" />
      <group position={[2.35, 0.1, 0]} scale={0.92}>
        <CoreMesh />
        <ParticleShell />
        <OrbitRing radius={2.15} tilt={0.9} speed={0.25} color="#38bdf8" />
        <OrbitRing radius={2.55} tilt={-0.55} speed={-0.18} color="#c084fc" />
      </group>
    </Canvas>
  );
}
