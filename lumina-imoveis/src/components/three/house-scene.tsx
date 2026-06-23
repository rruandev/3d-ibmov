'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  ContactShadows,
  Float,
  PerspectiveCamera,
  Html,
  useProgress,
} from '@react-three/drei'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-xs font-medium text-white/70">{progress.toFixed(0)}%</div>
    </Html>
  )
}

/**
 * Casa modernista procedural — sem GLB externo, garantindo
 * carregamento instantâneo e zero dependência de assets.
 */
function ModernHouse() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Térreo */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1, 2.4]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.7} />
      </mesh>
      {/* Pavimento superior recuado */}
      <mesh position={[-0.4, 1.5, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1, 2]} />
        <meshStandardMaterial color="#2a2d34" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Laje / cobertura */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[3.6, 0.12, 2.6]} />
        <meshStandardMaterial color="#15171c" roughness={0.6} />
      </mesh>
      {/* Vidro frontal */}
      <mesh position={[0, 0.55, 1.21]}>
        <planeGeometry args={[2.6, 0.85]} />
        <meshStandardMaterial
          color="#1A6FB5"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.65}
          emissive="#0F4C81"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Janelas superiores acesas */}
      <mesh position={[-0.4, 1.5, 1.11]}>
        <planeGeometry args={[1.8, 0.6]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.8} />
      </mesh>
      {/* Piscina */}
      <mesh position={[2.4, 0.02, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 1]} />
        <meshStandardMaterial color="#1A6FB5" roughness={0.05} metalness={0.5} transparent opacity={0.85} />
      </mesh>
      {/* Deck */}
      <mesh position={[2.4, 0, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.4, 1.8]} />
        <meshStandardMaterial color="#8a6d4b" roughness={0.9} />
      </mesh>
      {/* Vegetação estilizada */}
      {[
        [-1.9, 0.3, 0.9],
        [-1.9, 0.3, -0.7],
        [1.9, 0.3, -0.9],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#2f5d3a" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export default function HouseScene() {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[5, 3.5, 6]} fov={42} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={2}
        color="#fff4dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 3, -2]} intensity={30} color="#0F4C81" />

      <Suspense fallback={<Loader />}>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
          <ModernHouse />
        </Float>
        <ContactShadows position={[0, -1, 0]} opacity={0.55} scale={14} blur={2.6} far={6} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </Canvas>
  )
}
