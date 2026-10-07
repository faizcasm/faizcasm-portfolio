"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Decorative WebGL scene for the Ryuksaidso product spotlight:
 * a glowing "agent core" enclosed by a wireframe shell, encircled by a
 * control-plane ring with orbiting nodes (tools/providers) and a particle field.
 * Purely visual — renders behind the overlay with no pointer capture.
 */

function AgentCore() {
  const shell = useRef<THREE.Mesh>(null);
  const nucleus = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (shell.current) {
      shell.current.rotation.y += delta * 0.18;
      shell.current.rotation.x += delta * 0.07;
    }
    if (nucleus.current) {
      nucleus.current.rotation.y -= delta * 0.3;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.05;
      nucleus.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial
          color="#818cf8"
          wireframe
          transparent
          opacity={0.5}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh ref={nucleus}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.9}
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function ControlRing({
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
    ring.current.rotation.x = tilt + Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
  });

  return (
    <mesh ref={ring} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.014, 8, 150]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

function OrbitNodes({ count = 8, radius = 2.05 }: { count?: number; radius?: number }) {
  const group = useRef<THREE.Group>(null);

  const angles = useMemo(
    () => Array.from({ length: count }, (_, index) => (index / count) * Math.PI * 2),
    [count]
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={group}>
      {angles.map((angle, index) => (
        <mesh
          key={angle}
          position={[
            Math.cos(angle) * radius,
            Math.sin(index * 1.7) * 0.42,
            Math.sin(angle) * radius,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#38bdf8" : "#c084fc"}
            emissive={index % 2 === 0 ? "#0ea5e9" : "#a855f7"}
            emissiveIntensity={1.3}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function DataField({ count = 350 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.4 + Math.random() * 1.4;
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
    points.current.rotation.y -= delta * 0.04;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.1;
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
        size={0.03}
        color="#a5b4fc"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ProductScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.6, 6.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.75} />
      <pointLight position={[4, 3, 5]} intensity={90} color="#60a5fa" />
      <pointLight position={[-4, -2, 3]} intensity={70} color="#c084fc" />
      <group scale={0.95}>
        <AgentCore />
        <ControlRing radius={1.95} tilt={1.15} speed={0.3} color="#38bdf8" />
        <ControlRing radius={2.35} tilt={-0.5} speed={-0.2} color="#c084fc" />
        <OrbitNodes />
        <DataField />
      </group>
    </Canvas>
  );
}
