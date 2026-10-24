"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, BufferGeometry } from "three";
import * as THREE from "three";
import type { PortfolioSection } from "@/lib/content";

type Props = { sections: PortfolioSection[]; onSelect: (id: PortfolioSection["id"]) => void };

function NetworkCore() {
  const group = useRef<Group>(null);
  const { points, links } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const count = 620;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions.push(new THREE.Vector3(Math.cos(theta) * radius * 1.72, y * 1.72, Math.sin(theta) * radius * 1.72));
    }
    const pointArray = new Float32Array(positions.flatMap(p => [p.x, p.y, p.z]));
    const linePositions: number[] = [];
    positions.forEach((p, i) => {
      for (let j = i + 1; j < Math.min(i + 9, positions.length); j++) {
        if (p.distanceTo(positions[j]) < 0.43) {
          linePositions.push(p.x, p.y, p.z, positions[j].x, positions[j].y, positions[j].z);
        }
      }
    });
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(pointArray, 3));
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    return { points: pointGeometry, links: linkGeometry };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.045;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.055;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.7, 48, 48]} />
        <meshBasicMaterial color="#0b4a9b" wireframe transparent opacity={0.12} />
      </mesh>
      <points geometry={points}>
        <pointsMaterial color="#68c8ff" size={0.021} sizeAttenuation transparent opacity={0.92} depthWrite={false} />
      </points>
      <lineSegments geometry={links}>
        <lineBasicMaterial color="#258bff" transparent opacity={0.24} depthWrite={false} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[1.49, 32, 32]} />
        <meshBasicMaterial color="#1677ff" wireframe transparent opacity={0.055} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial color="#b9eaff" />
      </mesh>
      <pointLight color="#147aff" intensity={8} distance={5} />
    </group>
  );
}

function OrbitalRings() {
  const rings = useRef<Group>(null);
  useFrame((_, delta) => {
    if (rings.current) {
      rings.current.rotation.z += delta * 0.018;
      rings.current.rotation.y -= delta * 0.012;
    }
  });
  return (
    <group ref={rings}>
      <mesh rotation={[1.1, 0.3, 0.25]}>
        <torusGeometry args={[2.08, 0.004, 8, 180]} />
        <meshBasicMaterial color="#2d8dff" transparent opacity={0.48} />
      </mesh>
      <mesh rotation={[0.25, 1.22, 0.7]}>
        <torusGeometry args={[2.3, 0.003, 8, 180]} />
        <meshBasicMaterial color="#8bdfff" transparent opacity={0.26} />
      </mesh>
      <mesh rotation={[1.8, 0.15, 1.15]}>
        <torusGeometry args={[2.48, 0.002, 8, 180]} />
        <meshBasicMaterial color="#1658c9" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function SceneContent({ sections, onSelect }: Props) {
  return (
    <>
      <color attach="background" args={["#050914"]} />
      <fog attach="fog" args={["#050914", 8, 18]} />
      <ambientLight intensity={0.45} />
      <Stars radius={70} depth={40} count={1800} factor={2.2} saturation={0.2} fade speed={0.3} />
      <NetworkCore />
      <OrbitalRings />
      <Sparkles count={110} scale={7} size={1.5} speed={0.18} color="#4baaff" opacity={0.65} />
      {sections.map((section, index) => {
        const angle = (index / sections.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 2.65;
        const position: [number, number, number] = [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, Math.sin(angle * 1.4) * 0.4];
        return (
          <Html key={section.id} position={position} center distanceFactor={7.2} zIndexRange={[20, 0]}>
            <button className="orbit-node" onClick={() => onSelect(section.id)} aria-label={`Explore ${section.label}`}>
              <span className="node-dot" />
              <span>{section.label}</span>
            </button>
          </Html>
        );
      })}
      <OrbitControls enablePan={false} enableZoom={false} enableDamping dampingFactor={0.06} rotateSpeed={0.38} minPolarAngle={0.65} maxPolarAngle={2.5} />
    </>
  );
}

export default function OrbitScene({ sections, onSelect }: Props) {
  return (
    <div className="orbit-canvas" aria-label="Interactive 3D data sphere. Drag to rotate, or choose a labelled destination.">
      <Canvas camera={{ position: [0, 0, 8.8], fov: 40 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <SceneContent sections={sections} onSelect={onSelect} />
      </Canvas>
    </div>
  );
}
