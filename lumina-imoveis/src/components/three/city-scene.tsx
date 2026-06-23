'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Instance, Instances, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'

// ── Geração determinística da cidade ────────────────────────────
interface BuildingData {
  position: [number, number, number]
  height: number
  width: number
  depth: number
  emissive: number
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function useCity(gridSize = 14, spacing = 2.4) {
  return useMemo<BuildingData[]>(() => {
    const rng = mulberry32(20260623)
    const data: BuildingData[] = []
    const half = (gridSize * spacing) / 2
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const px = x * spacing - half + (rng() - 0.5) * 0.6
        const pz = z * spacing - half + (rng() - 0.5) * 0.6
        // Torres mais altas no centro (skyline)
        const distance = Math.hypot(px, pz) / half
        const centerBoost = (1 - distance) * 6
        const height = 0.6 + rng() * 3 + Math.max(0, centerBoost) * rng()
        if (rng() > 0.92) continue // alguns lotes vazios (praças)
        data.push({
          position: [px, height / 2, pz],
          height,
          width: 0.9 + rng() * 0.5,
          depth: 0.9 + rng() * 0.5,
          emissive: rng() > 0.6 ? rng() : 0,
        })
      }
    }
    return data
  }, [gridSize, spacing])
}

function Buildings() {
  const buildings = useCity()
  return (
    <Instances limit={buildings.length} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#15171c"
        roughness={0.55}
        metalness={0.6}
      />
      {buildings.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          scale={[b.width, b.height, b.depth]}
          color={b.emissive > 0 ? new THREE.Color('#D4AF37').multiplyScalar(0.25 + b.emissive * 0.5) : '#15171c'}
        />
      ))}
    </Instances>
  )
}

function Particles({ count = 240 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const rng = mulberry32(7)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rng() - 0.5) * 40
      arr[i * 3 + 1] = rng() * 14
      arr[i * 3 + 2] = (rng() - 0.5) * 40
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.02
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.4
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#D4AF37"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function Rig() {
  const { camera, pointer } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))
  useFrame(() => {
    // Parallax suave baseado no mouse
    camera.position.x += (pointer.x * 6 - camera.position.x) * 0.03
    camera.position.y += (5 + pointer.y * 2 - camera.position.y) * 0.03
    camera.lookAt(target.current)
  })
  return null
}

function MovingLight() {
  const ref = useRef<THREE.PointLight>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 0.4
    ref.current.position.x = Math.sin(t) * 14
    ref.current.position.z = Math.cos(t) * 14
  })
  return <pointLight ref={ref} color="#1A6FB5" intensity={120} distance={45} position={[10, 8, 0]} />
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#0A0A0A']} />
      <fog attach="fog" args={['#0A0A0A', 18, 42]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[10, 18, 8]}
        intensity={1.4}
        color="#fff6e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-12, 6, -8]} intensity={80} color="#0F4C81" distance={40} />
      <MovingLight />

      <Buildings />
      <Particles />

      {/* Piso reflexivo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#070708" roughness={0.4} metalness={0.8} />
      </mesh>

      <Rig />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  )
}

export default function CityScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 6, 20], fov: 45, near: 0.1, far: 100 }}
      frameloop="always"
    >
      <Scene />
    </Canvas>
  )
}
